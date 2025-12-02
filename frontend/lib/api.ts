import axios from 'axios';
import type {
  UserAttributes,
  Question,
  Scheme,
  JourneyPlan,
  OptimizedPortfolio,
  SchemeDetail,
  ExplainabilityData,
  GraphData,
  Persona,
} from '@/types';

// API Base URL - will be configured via env variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.detail
      || error.response?.data?.message
      || error.message
      || 'Unknown API error';

    const errorDetails = {
      message: errorMessage,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
    };

    console.error('API Error:', errorDetails);
    return Promise.reject(error);
  }
);

// Re-export types for convenience
export type {
  UserAttributes,
  Question,
  Scheme,
  JourneyPlan,
  OptimizedPortfolio,
  SchemeDetail,
  ExplainabilityData,
  GraphData,
  Persona,
}

// API Functions

/**
 * Get adaptive questions for eligibility determination
 */
export async function getQuestions(): Promise<Question[]> {
  const response = await apiClient.get<{questions: Question[], total_questions: number}>('/questions');
  return response.data.questions;
}

/**
 * Calculate eligible schemes based on user attributes
 */
export async function calculateEligibility(attributes: UserAttributes): Promise<Scheme[]> {
  const response = await apiClient.post<{eligible_schemes: Scheme[], total_count: number, summary: any}>('/eligibility', { attributes });
  return response.data.eligible_schemes;
}

/**
 * Get life journey plan with timeline
 */
export async function getJourneyPlan(
  userAge: number,
  eligibleSchemeIds: string[],
  hasSchoolChildren?: boolean,
  occupation?: string
): Promise<JourneyPlan> {
  const response = await apiClient.post<JourneyPlan>('/journey', {
    user_age: userAge,
    eligible_scheme_ids: eligibleSchemeIds,
    has_school_children: hasSchoolChildren || false,
    occupation: occupation || null,
  });
  return response.data;
}

/**
 * Optimize scheme portfolio (resolve conflicts, maximize value)
 */
export async function optimizeSchemes(schemes: Scheme[]): Promise<OptimizedPortfolio> {
  const response = await apiClient.post<OptimizedPortfolio>('/optimize', { schemes });
  return response.data;
}

/**
 * Get detailed information about a specific scheme
 */
export async function getSchemeById(schemeId: string): Promise<SchemeDetail> {
  const response = await apiClient.get<SchemeDetail>(`/schemes/${schemeId}`);
  return response.data;
}

/**
 * Get eligibility explanation with graph path and legal citations
 */
export async function explainEligibility(
  schemeId: string,
  attributes: UserAttributes
): Promise<ExplainabilityData> {
  const response = await apiClient.get<ExplainabilityData>(`/schemes/${schemeId}/explain`, {
    params: { attributes: JSON.stringify(attributes) },
  });
  return response.data;
}

/**
 * Get knowledge graph data for visualization
 */
export async function getGraphData(): Promise<GraphData> {
  const response = await apiClient.get<GraphData>('/graph');
  return response.data;
}

/**
 * Get list of demo personas
 */
export async function getPersonas(): Promise<Persona[]> {
  const response = await apiClient.get<{personas: Persona[]}>('/personas');
  return response.data.personas;
}

/**
 * Get specific persona by ID with pre-filled attributes
 */
export async function getPersonaById(personaId: string): Promise<Persona> {
  const response = await apiClient.get<{persona: Persona}>(`/personas/${personaId}`);
  return response.data.persona;
}

// Export the axios instance for custom requests
export default apiClient;
