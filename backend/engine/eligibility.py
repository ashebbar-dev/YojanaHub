import json
from typing import Dict, List, Tuple, Any
from database.connection import query_db
from models.schemas import UserAttributes, SchemeBasic

class EligibilityEngine:
    """Core algorithm for matching users to schemes"""

    def __init__(self):
        """Initialize engine and load schemes and rules"""
        self.schemes = {}
        self.rules = {}
        self._load_data()

    def _load_data(self):
        """Load schemes and rules from database"""
        # Load schemes
        schemes_query = "SELECT * FROM schemes WHERE is_active = 1"
        scheme_rows = query_db(schemes_query)

        for row in scheme_rows:
            self.schemes[row['id']] = dict(row)

        # Load rules
        rules_query = "SELECT * FROM scheme_rules"
        rule_rows = query_db(rules_query)

        for row in rule_rows:
            scheme_id = row['scheme_id']
            if scheme_id not in self.rules:
                self.rules[scheme_id] = []
            self.rules[scheme_id].append(dict(row))

        print(f"[INFO] Loaded {len(self.schemes)} schemes and rules for eligibility engine")

    def evaluate_rule(self, rule: Dict, user_attrs: Dict[str, Any]) -> bool:
        """
        Evaluate a single rule against user attributes

        Args:
            rule: Rule dictionary with attribute, operator, value
            user_attrs: User attributes dictionary

        Returns:
            bool: True if rule is satisfied
        """
        attribute = rule['attribute']
        operator = rule['operator']
        rule_value = rule['value']

        # Get user value for this attribute
        user_value = user_attrs.get(attribute)

        # If user doesn't have this attribute, consider it as not matched
        if user_value is None:
            return False

        # Parse rule value (it's stored as JSON string)
        try:
            if rule_value.startswith('[') or rule_value.startswith('{'):
                parsed_value = json.loads(rule_value)
            elif rule_value.lower() == 'true':
                parsed_value = True
            elif rule_value.lower() == 'false':
                parsed_value = False
            else:
                parsed_value = rule_value
        except:
            parsed_value = rule_value

        # Evaluate based on operator
        if operator == 'eq':
            return user_value == parsed_value

        elif operator == 'neq':
            return user_value != parsed_value

        elif operator == 'lt':
            try:
                return float(user_value) < float(parsed_value)
            except:
                return False

        elif operator == 'lte':
            try:
                return float(user_value) <= float(parsed_value)
            except:
                return False

        elif operator == 'gt':
            try:
                return float(user_value) > float(parsed_value)
            except:
                return False

        elif operator == 'gte':
            try:
                return float(user_value) >= float(parsed_value)
            except:
                return False

        elif operator == 'in':
            if isinstance(parsed_value, list):
                return user_value in parsed_value
            return False

        elif operator == 'not_in':
            if isinstance(parsed_value, list):
                return user_value not in parsed_value
            return True

        elif operator == 'exists':
            return user_value is not None

        return False

    def check_eligibility(self, scheme_id: str, user_attrs: Dict[str, Any]) -> Tuple[bool, float, List[str], List[str]]:
        """
        Check if user is eligible for a specific scheme

        Args:
            scheme_id: Scheme ID
            user_attrs: User attributes dictionary

        Returns:
            Tuple of (is_eligible, confidence, matched_rules, blocking_conditions)
        """
        if scheme_id not in self.rules:
            # No rules means everyone is eligible (soft eligibility)
            return (True, 0.5, [], [])

        rules = self.rules[scheme_id]
        hard_constraints = [r for r in rules if r['is_hard_constraint'] == 1]
        soft_constraints = [r for r in rules if r['is_hard_constraint'] == 0]

        matched_rules = []
        blocking_conditions = []

        # Check hard constraints (must all be satisfied)
        for rule in hard_constraints:
            if self.evaluate_rule(rule, user_attrs):
                matched_rules.append(rule['attribute'])
            else:
                blocking_conditions.append(rule['description'] or f"{rule['attribute']} not matched")

        # If any hard constraint fails, not eligible
        if blocking_conditions:
            return (False, 0.0, matched_rules, blocking_conditions)

        # Check soft constraints (improve confidence)
        soft_matched = 0
        for rule in soft_constraints:
            if self.evaluate_rule(rule, user_attrs):
                matched_rules.append(rule['attribute'])
                soft_matched += 1

        # Calculate confidence
        confidence = self._calculate_confidence(
            len(hard_constraints),
            len(hard_constraints),  # All hard constraints matched
            len(soft_constraints),
            soft_matched
        )

        return (True, confidence, matched_rules, blocking_conditions)

    def _calculate_confidence(self, total_hard: int, matched_hard: int,
                             total_soft: int, matched_soft: int) -> float:
        """
        Calculate confidence score

        Args:
            total_hard: Total hard constraints
            matched_hard: Matched hard constraints
            total_soft: Total soft constraints
            matched_soft: Matched soft constraints

        Returns:
            float: Confidence between 0.0 and 1.0
        """
        if total_hard == 0 and total_soft == 0:
            return 0.5  # No rules, medium confidence

        if total_hard > 0 and matched_hard < total_hard:
            return 0.0  # Hard constraints not met

        # All hard constraints met
        if total_soft == 0:
            return 1.0  # No soft constraints, full confidence

        # Calculate based on soft constraints
        soft_ratio = matched_soft / total_soft if total_soft > 0 else 1.0

        # Confidence: 1.0 if all soft matched, 0.8 if 50%+ matched, 0.6 otherwise
        if soft_ratio >= 0.9:
            return 1.0
        elif soft_ratio >= 0.7:
            return 0.9
        elif soft_ratio >= 0.5:
            return 0.8
        elif soft_ratio >= 0.3:
            return 0.7
        else:
            return 0.6

    def _get_confidence_label(self, confidence: float) -> str:
        """
        Get human-readable confidence label

        Args:
            confidence: Confidence score 0.0-1.0

        Returns:
            str: Confidence label
        """
        if confidence >= 0.9:
            return "Eligible"
        elif confidence >= 0.7:
            return "Highly Likely"
        elif confidence >= 0.5:
            return "May Qualify"
        else:
            return "Conditional"

    def find_all_eligible(self, user_attrs: UserAttributes, include_probabilistic: bool = True) -> List[SchemeBasic]:
        """
        Find all eligible schemes for a user

        Args:
            user_attrs: User attributes
            include_probabilistic: Include schemes with <100% confidence

        Returns:
            List[SchemeBasic]: List of eligible schemes
        """
        # Convert Pydantic model to dict, excluding None values
        attrs_dict = {k: v for k, v in user_attrs.dict().items() if v is not None}

        eligible_schemes = []

        for scheme_id, scheme in self.schemes.items():
            is_eligible, confidence, matched_rules, blocking_conditions = self.check_eligibility(
                scheme_id, attrs_dict
            )

            # Include scheme if eligible
            if is_eligible:
                # Filter based on probabilistic flag
                if not include_probabilistic and confidence < 1.0:
                    continue

                scheme_basic = SchemeBasic(
                    id=scheme['id'],
                    name=scheme['name'],
                    name_hindi=scheme.get('name_hindi'),
                    ministry=scheme['ministry'],
                    benefit_type=scheme['benefit_type'],
                    benefit_value=scheme.get('benefit_value'),
                    benefit_frequency=scheme['benefit_frequency'],
                    icon=scheme['icon'],
                    category=scheme['category'],
                    state=scheme.get('state'),
                    confidence=confidence,
                    confidence_label=self._get_confidence_label(confidence),
                    matched_rules=matched_rules,
                    blocking_conditions=blocking_conditions
                )

                eligible_schemes.append(scheme_basic)

        # Sort by confidence (highest first)
        eligible_schemes.sort(key=lambda x: x.confidence, reverse=True)

        return eligible_schemes
