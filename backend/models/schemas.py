from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# ============= USER & ATTRIBUTES =============

class UserAttributes(BaseModel):
    """User attributes for eligibility calculation"""
    state: Optional[str] = None
    area_type: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[int] = None
    occupation: Optional[str] = None
    bpl_status: Optional[bool] = None
    annual_income: Optional[str] = None
    caste_category: Optional[str] = None
    has_school_children: Optional[bool] = None
    marital_status: Optional[str] = None
    has_cultivable_land: Optional[bool] = None
    land_holding: Optional[int] = None
    income_tax_payer: Optional[bool] = None
    is_student: Optional[bool] = None
    education_level: Optional[str] = None
    children_count: Optional[int] = None
    has_lpg_connection: Optional[bool] = None
    owns_pucca_house: Optional[bool] = None

# ============= SCHEMES =============

class SchemeBasic(BaseModel):
    """Basic scheme information for list views"""
    id: str
    name: str
    name_hindi: Optional[str] = None
    ministry: str
    benefit_type: str
    benefit_value: Optional[int] = None
    benefit_frequency: str
    icon: str
    category: str
    state: Optional[str] = None
    confidence: float = 1.0
    confidence_label: str = "Eligible"
    matched_rules: List[str] = []
    blocking_conditions: List[str] = []

class SchemeDocument(BaseModel):
    """Scheme document information"""
    document_name: str
    document_name_hindi: Optional[str] = None
    is_mandatory: bool
    how_to_obtain: Optional[str] = None
    typical_time: Optional[str] = None

class SchemeDetail(BaseModel):
    """Detailed scheme information"""
    id: str
    name: str
    name_hindi: Optional[str] = None
    ministry: str
    description: str
    description_hindi: Optional[str] = None
    benefit_type: str
    benefit_value: Optional[int] = None
    benefit_frequency: str
    life_stages: Optional[List[str]] = None
    trigger_events: Optional[List[str]] = None
    application_url: Optional[str] = None
    application_mode: str
    deadline: Optional[str] = None
    legal_citation: Optional[str] = None
    icon: str
    category: str
    state: Optional[str] = None
    documents: List[SchemeDocument] = []
    related_schemes: List[str] = []
    conflicts_with: List[str] = []

# ============= ELIGIBILITY =============

class EligibilityRequest(BaseModel):
    """Request body for eligibility calculation"""
    attributes: UserAttributes
    include_probabilistic: bool = True

class EligibilitySummary(BaseModel):
    """Summary statistics for eligibility results"""
    eligible_count: int = 0
    highly_likely_count: int = 0
    conditional_count: int = 0
    total_annual_value: int = 0

class EligibilityResponse(BaseModel):
    """Response with list of eligible schemes"""
    eligible_schemes: List[SchemeBasic]
    total_count: int
    summary: EligibilitySummary

# ============= JOURNEY PLANNER =============

class LifeEvent(BaseModel):
    """Life event in journey timeline"""
    event: str
    age: int
    year: int
    description: str

class JourneyPhase(BaseModel):
    """Phase in life journey"""
    phase_name: str  # "Immediate", "Short-term", "Medium-term", "Long-term"
    year_range: str
    schemes: List[str]
    total_value: int
    life_events: List[LifeEvent] = []

class JourneyResponse(BaseModel):
    """Life journey planning response"""
    phases: List[JourneyPhase]
    lifetime_potential: int
    timeline_data: List[Dict[str, Any]] = []

# ============= OPTIMIZER =============

class ConflictResolution(BaseModel):
    """Conflict resolution details"""
    schemes: List[str]
    resolution: str
    selected_scheme: str
    value_difference: int

class StackingBenefit(BaseModel):
    """Schemes that can be stacked"""
    schemes: List[str]
    combined_value: int
    note: str

class OptimizerLayer(BaseModel):
    """Layer in benefit stack visualization"""
    name: str
    schemes: List[str]

class OptimizedPortfolio(BaseModel):
    """Optimized scheme portfolio"""
    selected_schemes: List[SchemeBasic]
    total_annual_value: int
    conflicts_resolved: List[ConflictResolution] = []
    stacking_benefits: List[StackingBenefit] = []
    visualization_layers: List[OptimizerLayer] = []

class OptimizeRequest(BaseModel):
    """Request for scheme optimization"""
    eligible_scheme_ids: List[str]
    max_applications: Optional[int] = None
    prefer_online: bool = True

class OptimizeResponse(BaseModel):
    """Optimization response"""
    optimized_portfolio: OptimizedPortfolio
    excluded_schemes: List[Dict[str, str]] = []

# ============= GRAPH VISUALIZATION =============

class GraphNode(BaseModel):
    """Node in knowledge graph"""
    id: str
    type: str  # "user", "attribute", "scheme"
    label: str
    data: Dict[str, Any] = {}
    position: Dict[str, float] = {}

class GraphEdge(BaseModel):
    """Edge in knowledge graph"""
    source: str
    target: str
    type: str  # "has_attribute", "qualifies_for", "conflicts_with"
    label: Optional[str] = None

class GraphResponse(BaseModel):
    """Knowledge graph visualization data"""
    nodes: List[GraphNode]
    edges: List[GraphEdge]

# ============= QUESTIONS =============

class QuestionOption(BaseModel):
    """Option for a question"""
    value: str
    label: Dict[str, str]  # {"en": "...", "hi": "..."}

class Question(BaseModel):
    """Adaptive question"""
    id: str
    attribute: str
    text: Dict[str, str]  # {"en": "...", "hi": "..."}
    input_type: str
    options: Optional[List[QuestionOption]] = None
    priority: int

class QuestionsResponse(BaseModel):
    """List of questions"""
    questions: List[Question]
    total_questions: int

# ============= PERSONAS =============

class Persona(BaseModel):
    """Demo persona"""
    id: str
    name: str
    name_hindi: Optional[str] = None
    age: int
    attributes: UserAttributes
    story: str
    story_hindi: Optional[str] = None
    expected_scheme_count: int

class PersonasResponse(BaseModel):
    """List of personas"""
    personas: List[Persona]

# ============= LEAKAGE DASHBOARD =============

class SchemeLeakage(BaseModel):
    """Leakage statistics for a scheme"""
    scheme_id: str
    scheme_name: str
    eligible_count: int
    enrolled_count: int
    gap_count: int
    gap_percentage: float
    unclaimed_value: int

class LeakageResponse(BaseModel):
    """Dashboard leakage statistics"""
    district: str
    state: str
    total_unclaimed_value: int
    average_gap_percentage: float
    scheme_leakages: List[SchemeLeakage]

# ============= EXPLAINABILITY =============

class ExplainCondition(BaseModel):
    """Matched condition for explainability"""
    attribute: str
    required: str
    user_value: str
    status: str  # "✓ Matched" or "✗ Not Matched"

class LegalBasis(BaseModel):
    """Legal citation for scheme"""
    citation: str
    text: str
    source_url: Optional[str] = None

class GraphPathNode(BaseModel):
    """Node in eligibility graph path"""
    node: str
    type: str  # "start", "attribute", "scheme"
    matched: bool = True

class ExplainabilityResponse(BaseModel):
    """Eligibility explanation"""
    scheme_id: str
    is_eligible: bool
    confidence: float
    graph_path: List[GraphPathNode]
    matched_conditions: List[ExplainCondition]
    legal_basis: Optional[LegalBasis] = None
    plain_language: str
