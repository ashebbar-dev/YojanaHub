// Core entity types
export interface UserAttributes {
  age?: number;
  gender?: string;
  state?: string;
  occupation?: string;
  income?: number;
  caste?: string;
  bpl_status?: boolean;
  disability?: boolean;
  marital_status?: string;
  children?: number;
  education?: string;
  [key: string]: any;
}

export interface Question {
  id: string;
  text: {
    en: string;
    hi: string;
  };
  input_type: 'select' | 'radio' | 'number' | 'text';
  options?: Array<{
    value: string;
    label: {
      en: string;
      hi: string;
    };
  }> | null;
  attribute: string;
  priority?: number;
  help_text?: string;
}

export interface Scheme {
  id: string;
  name: string;
  name_hi?: string;
  description: string;
  description_hi?: string;
  ministry: string;
  state?: string;
  category?: string;
  benefit_type: string;
  benefit_value?: number;
  benefit_frequency?: string;
  confidence?: number;
  matched_conditions?: string[];
  blocking_conditions?: string[];
  conflicts?: string[];
  icon?: string;
}

export interface SchemeRule {
  id: string;
  scheme_id: string;
  condition: string;
  condition_hi?: string;
  type: 'hard' | 'soft';
  attribute: string;
  operator: string;
  value: any;
  weight?: number;
}

export interface SchemeDocument {
  id: string;
  scheme_id: string;
  document_name: string;
  document_name_hi?: string;
  is_required: boolean;
  description?: string;
}

export interface SchemeRelation {
  from_scheme_id: string;
  to_scheme_id: string;
  relation_type: 'CONFLICTS' | 'DEPENDS' | 'STACKS' | 'UNLOCKS';
  description?: string;
}

// Journey planning types
export interface JourneyStage {
  age_range: [number, number];
  stage_name: string;
  stage_name_hi?: string;
  schemes: Scheme[];
  total_value: number;
  milestones: string[];
  milestones_hi?: string[];
}

export interface JourneyPlan {
  stages: JourneyStage[];
  total_lifetime_value: number;
  timeline_data: Array<{
    age: number;
    annual_benefit: number;
    schemes: string[];
  }>;
}

// Optimization types
export interface ConflictResolution {
  chosen: string;
  rejected: string[];
  reason: string;
  value_difference?: number;
}

export interface OptimizedPortfolio {
  selected_schemes: Scheme[];
  total_value: number;
  conflicts_resolved: ConflictResolution[];
  dependencies_satisfied: boolean;
  warnings?: string[];
}

// Scheme detail types
export interface SchemeDetail extends Scheme {
  eligibility_rules: Array<{
    condition: string;
    condition_hi?: string;
    type: 'hard' | 'soft';
    matched: boolean;
  }>;
  documents_required: SchemeDocument[];
  application_process: string[];
  application_process_hi?: string[];
  official_website?: string;
  helpline?: string;
  gazette_reference?: string;
}

// Explainability types
export interface GraphPath {
  from: string;
  to: string;
  edge_type: string;
  label: string;
  label_hi?: string;
}

export interface LegalCitation {
  rule: string;
  source: string;
  section?: string;
  url?: string;
  date?: string;
}

export interface ExplainabilityData {
  scheme_id: string;
  scheme_name: string;
  eligible: boolean;
  confidence: number;
  graph_path: GraphPath[];
  matched_rules: string[];
  blocking_rules: string[];
  legal_citations: LegalCitation[];
  explanation_text?: string;
  explanation_text_hi?: string;
}

// Graph visualization types
export interface GraphNode {
  id: string;
  label: string;
  label_hi?: string;
  type: 'user' | 'scheme' | 'document' | 'benefit' | 'attribute' | 'condition';
  data?: any;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  type: string;
  label?: string;
  label_hi?: string;
  weight?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  focused_scheme_id?: string;
}

// Persona types
export interface Persona {
  id: string;
  name: string;
  name_hindi?: string;
  age: number;
  description: string;
  description_hi?: string;
  attributes: UserAttributes;
  expected_schemes: number;
  expected_value: number;
  avatar?: string;
}

// Dashboard types
export interface LeakageStatistics {
  district: string;
  state: string;
  population: number;
  eligible_population: number;
  beneficiaries: number;
  leakage_rate: number;
  unclaimed_value: number;
  top_unclaimed_schemes: Array<{
    scheme_id: string;
    scheme_name: string;
    eligible_count: number;
    claimed_count: number;
    leakage_count: number;
  }>;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

// UI component types
export interface TabItem {
  id: string;
  label: string;
  label_hi?: string;
  icon?: React.ComponentType;
}

export interface ProgressStep {
  id: string;
  label: string;
  label_hi?: string;
  completed: boolean;
  active: boolean;
}

export interface FilterOption {
  id: string;
  label: string;
  label_hi?: string;
  value: any;
}

// Form types
export interface QuestionFormData {
  [questionId: string]: any;
}

export interface SchemeFilterForm {
  ministry?: string;
  state?: string;
  benefit_type?: string;
  min_value?: number;
  max_value?: number;
  search?: string;
}

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

// Utility types
export type Language = 'en' | 'hi';

export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  order: SortOrder;
}

export type ViewMode = 'grid' | 'list' | 'table';

// Export all types as a namespace
export namespace SchemeGraph {
  export type User = UserAttributes;
  export type SchemeEntity = Scheme;
  export type QuestionEntity = Question;
  export type Journey = JourneyPlan;
  export type Portfolio = OptimizedPortfolio;
  export type Graph = GraphData;
}
