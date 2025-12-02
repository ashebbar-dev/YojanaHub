from typing import Dict, List, Any
from datetime import datetime
from models.schemas import UserAttributes, JourneyPhase, LifeEvent
from database.connection import query_db
import json

class JourneyPlanner:
    """Life journey planning engine"""

    def __init__(self):
        """Initialize planner"""
        pass

    def generate_journey(
        self,
        user_attrs: UserAttributes,
        eligible_scheme_ids: List[str]
    ) -> Dict[str, Any]:
        """
        Generate life journey plan

        Returns phases: immediate, short_term, medium_term, long_term
        """
        current_year = datetime.now().year
        user_age = user_attrs.age or 30  # Default if not provided

        # Fetch schemes
        if not eligible_scheme_ids:
            return self._empty_journey()

        placeholders = ','.join('?' * len(eligible_scheme_ids))
        query = f"SELECT * FROM schemes WHERE id IN ({placeholders})"
        schemes = query_db(query, tuple(eligible_scheme_ids))

        # Initialize phases
        phases = {
            'immediate': [],
            'short_term': [],
            'medium_term': [],
            'long_term': []
        }

        # Categorize schemes
        for scheme in schemes:
            phase = self._categorize_scheme(scheme, user_attrs)
            phases[phase].append(scheme['id'])

        # Generate life events
        life_events = self._predict_life_events(user_attrs, current_year)

        # Build phase objects
        phase_list = [
            self._build_phase(
                "Immediate",
                f"{current_year}",
                phases['immediate'],
                schemes,
                [e for e in life_events if e.year == current_year]
            ),
            self._build_phase(
                "Short-term",
                f"{current_year + 1}-{current_year + 2}",
                phases['short_term'],
                schemes,
                [e for e in life_events if current_year + 1 <= e.year <= current_year + 2]
            ),
            self._build_phase(
                "Medium-term",
                f"{current_year + 3}-{current_year + 5}",
                phases['medium_term'],
                schemes,
                [e for e in life_events if current_year + 3 <= e.year <= current_year + 5]
            ),
            self._build_phase(
                "Long-term",
                f"{current_year + 6}+",
                phases['long_term'],
                schemes,
                [e for e in life_events if e.year > current_year + 5]
            )
        ]

        # Calculate lifetime potential
        lifetime_potential = sum(
            self._calculate_phase_value(phase.schemes, schemes)
            for phase in phase_list
        ) * 10  # Estimate 10 years

        # Build timeline data for visualization
        timeline_data = self._build_timeline_data(phase_list, current_year)

        return {
            'phases': phase_list,
            'lifetime_potential': lifetime_potential,
            'timeline_data': timeline_data
        }

    def _categorize_scheme(self, scheme: Dict, user_attrs: UserAttributes) -> str:
        """Categorize scheme into a phase"""
        # Immediate: One-time benefits or urgent needs
        if scheme['benefit_frequency'] == 'one_time':
            return 'immediate'

        # Short-term: Annual/regular benefits with no long-term commitment
        if scheme['benefit_frequency'] in ['annual', 'monthly']:
            return 'short_term'

        # Long-term: Pension schemes, insurance
        if 'pension' in scheme['name'].lower() or 'insurance' in scheme['benefit_type']:
            return 'long_term'

        # Default to short-term
        return 'short_term'

    def _predict_life_events(self, user_attrs: UserAttributes, current_year: int) -> List[LifeEvent]:
        """Predict future life events based on user attributes"""
        events = []
        user_age = user_attrs.age or 30

        # Children's education milestones
        if user_attrs.has_school_children:
            events.append(LifeEvent(
                event="Child's Secondary Education",
                age=user_age + 3,
                year=current_year + 3,
                description="Child entering high school"
            ))
            events.append(LifeEvent(
                event="Child's Higher Education",
                age=user_age + 8,
                year=current_year + 8,
                description="Child entering college"
            ))

        # Retirement
        if user_age < 60:
            years_to_retirement = 60 - user_age
            events.append(LifeEvent(
                event="Retirement",
                age=60,
                year=current_year + years_to_retirement,
                description="Reaching retirement age"
            ))

        # Farmer-specific
        if user_attrs.occupation == "farmer":
            events.append(LifeEvent(
                event="Next Crop Season",
                age=user_age,
                year=current_year,
                description="Kharif season planting"
            ))

        return events

    def _build_phase(
        self,
        phase_name: str,
        year_range: str,
        scheme_ids: List[str],
        all_schemes: List[Dict],
        life_events: List[LifeEvent]
    ) -> JourneyPhase:
        """Build a journey phase object"""
        total_value = self._calculate_phase_value(scheme_ids, all_schemes)

        return JourneyPhase(
            phase_name=phase_name,
            year_range=year_range,
            schemes=scheme_ids,
            total_value=total_value,
            life_events=life_events
        )

    def _calculate_phase_value(self, scheme_ids: List[str], all_schemes: List[Dict]) -> int:
        """Calculate total annual value for schemes in a phase"""
        total = 0
        for scheme in all_schemes:
            if scheme['id'] in scheme_ids and scheme['benefit_value']:
                value = scheme['benefit_value']
                freq = scheme['benefit_frequency']

                if freq == 'annual':
                    total += value
                elif freq == 'monthly':
                    total += value * 12
                elif freq == 'quarterly':
                    total += value * 4
                # one_time not included in annual

        return total

    def _build_timeline_data(self, phases: List[JourneyPhase], current_year: int) -> List[Dict]:
        """Build timeline visualization data"""
        timeline = []
        for i, phase in enumerate(phases):
            timeline.append({
                'phase': phase.phase_name,
                'year': current_year + (i * 2),  # Approximate year markers
                'value': phase.total_value,
                'scheme_count': len(phase.schemes)
            })
        return timeline

    def _empty_journey(self) -> Dict[str, Any]:
        """Return empty journey structure"""
        return {
            'phases': [],
            'lifetime_potential': 0,
            'timeline_data': []
        }
