from typing import List, Dict
from database.connection import query_db
from models.schemas import (
    SchemeBasic,
    ConflictResolution,
    StackingBenefit,
    OptimizerLayer
)

class SchemeOptimizer:
    """Scheme portfolio optimization engine"""

    def __init__(self):
        """Initialize optimizer and load relationships"""
        self.conflicts = {}
        self.stacks = {}
        self._load_relationships()

    def _load_relationships(self):
        """Load scheme relationships from database"""
        # Load conflicts
        conflict_query = """
            SELECT scheme_id_1, scheme_id_2, description
            FROM scheme_relations
            WHERE relation_type = 'conflicts'
        """
        conflict_rows = query_db(conflict_query)
        for row in conflict_rows:
            row_dict = dict(row)
            s1, s2 = row_dict['scheme_id_1'], row_dict['scheme_id_2']
            if s1 not in self.conflicts:
                self.conflicts[s1] = []
            self.conflicts[s1].append(s2)
            # Bidirectional
            if s2 not in self.conflicts:
                self.conflicts[s2] = []
            self.conflicts[s2].append(s1)

        # Load stacks
        stack_query = """
            SELECT scheme_id_1, scheme_id_2, description
            FROM scheme_relations
            WHERE relation_type = 'stacks'
        """
        stack_rows = query_db(stack_query)
        for row in stack_rows:
            row_dict = dict(row)
            s1, s2 = row_dict['scheme_id_1'], row_dict['scheme_id_2']
            if s1 not in self.stacks:
                self.stacks[s1] = []
            self.stacks[s1].append(s2)

    def optimize_portfolio(
        self,
        eligible_schemes: List[SchemeBasic],
        max_applications: int = None,
        prefer_online: bool = True
    ) -> Dict:
        """
        Optimize scheme portfolio

        Returns optimized selection with conflicts resolved and stacking identified
        """
        # Build scheme lookup
        scheme_map = {s.id: s for s in eligible_schemes}

        # Detect conflicts
        conflicts_found = []
        excluded_scheme_ids = set()

        for scheme in eligible_schemes:
            if scheme.id in self.conflicts:
                for conflict_id in self.conflicts[scheme.id]:
                    if conflict_id in scheme_map and conflict_id not in excluded_scheme_ids:
                        # Conflict detected, resolve it
                        resolution = self._resolve_conflict(
                            scheme,
                            scheme_map[conflict_id]
                        )
                        conflicts_found.append(resolution)

                        # Exclude the non-selected scheme
                        if resolution.selected_scheme != scheme.id:
                            excluded_scheme_ids.add(scheme.id)
                        else:
                            excluded_scheme_ids.add(conflict_id)

        # Selected schemes (after conflict resolution)
        selected_schemes = [
            s for s in eligible_schemes
            if s.id not in excluded_scheme_ids
        ]

        # Apply max applications limit
        if max_applications and len(selected_schemes) > max_applications:
            # Sort by value and take top N
            selected_schemes.sort(
                key=lambda s: (s.benefit_value or 0),
                reverse=True
            )
            excluded = selected_schemes[max_applications:]
            selected_schemes = selected_schemes[:max_applications]

            for scheme in excluded:
                excluded_scheme_ids.add(scheme.id)

        # Identify stacking benefits
        stacking_benefits = self._identify_stacking(selected_schemes, scheme_map)

        # Build visualization layers
        layers = self._build_layers(selected_schemes)

        # Calculate total value
        total_annual_value = sum(
            self._annualize_value(s.benefit_value, s.benefit_frequency)
            for s in selected_schemes
            if s.benefit_value
        )

        # Build excluded list
        excluded_schemes = [
            {
                "id": s.id,
                "name": s.name,
                "reason": "Conflict with higher-value scheme" if s.id in excluded_scheme_ids else "Not in top selection"
            }
            for s in eligible_schemes
            if s.id in excluded_scheme_ids
        ]

        return {
            'selected_schemes': selected_schemes,
            'total_annual_value': total_annual_value,
            'conflicts_resolved': conflicts_found,
            'stacking_benefits': stacking_benefits,
            'visualization_layers': layers,
            'excluded_schemes': excluded_schemes
        }

    def _resolve_conflict(
        self,
        scheme1: SchemeBasic,
        scheme2: SchemeBasic
    ) -> ConflictResolution:
        """Resolve conflict between two schemes by choosing higher value"""
        value1 = self._annualize_value(scheme1.benefit_value, scheme1.benefit_frequency)
        value2 = self._annualize_value(scheme2.benefit_value, scheme2.benefit_frequency)

        if value1 >= value2:
            selected = scheme1.id
            value_diff = value1 - value2
        else:
            selected = scheme2.id
            value_diff = value2 - value1

        return ConflictResolution(
            schemes=[scheme1.id, scheme2.id],
            resolution=f"Selected {selected} due to higher benefit value",
            selected_scheme=selected,
            value_difference=value_diff
        )

    def _identify_stacking(
        self,
        selected: List[SchemeBasic],
        scheme_map: Dict[str, SchemeBasic]
    ) -> List[StackingBenefit]:
        """Identify schemes that can be stacked"""
        stacking = []

        for scheme in selected:
            if scheme.id in self.stacks:
                for stack_id in self.stacks[scheme.id]:
                    if stack_id in [s.id for s in selected]:
                        # Both schemes selected, they stack!
                        combined_value = (
                            self._annualize_value(scheme.benefit_value, scheme.benefit_frequency) +
                            self._annualize_value(scheme_map[stack_id].benefit_value, scheme_map[stack_id].benefit_frequency)
                        )

                        stacking.append(StackingBenefit(
                            schemes=[scheme.id, stack_id],
                            combined_value=combined_value,
                            note="These schemes complement each other and can be claimed together"
                        ))

        return stacking

    def _build_layers(self, schemes: List[SchemeBasic]) -> List[OptimizerLayer]:
        """Build visualization layers for benefit stack"""
        layers = {
            'Foundation': [],
            'Income': [],
            'Protection': []
        }

        for scheme in schemes:
            if scheme.benefit_type == 'cash':
                layers['Income'].append(scheme.id)
            elif scheme.benefit_type in ['insurance', 'kind']:
                layers['Protection'].append(scheme.id)
            else:
                layers['Foundation'].append(scheme.id)

        return [
            OptimizerLayer(name=name, schemes=scheme_ids)
            for name, scheme_ids in layers.items()
            if scheme_ids
        ]

    def _annualize_value(self, value: int, frequency: str) -> int:
        """Convert benefit value to annual equivalent"""
        if not value:
            return 0

        if frequency == 'annual':
            return value
        elif frequency == 'monthly':
            return value * 12
        elif frequency == 'quarterly':
            return value * 4
        else:  # one_time
            return 0  # Don't include in annual calculation
