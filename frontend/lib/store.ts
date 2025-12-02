import * as React from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  UserAttributes,
  Scheme,
  JourneyPlan,
  OptimizedPortfolio,
  Question,
} from './api';

// Store state interface
interface AppState {
  // User data
  userAttributes: UserAttributes;
  setUserAttributes: (attributes: UserAttributes) => void;
  updateUserAttribute: (key: string, value: any) => void;
  clearUserAttributes: () => void;

  // Questions and flow
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  answeredQuestions: Record<string, any>;
  setAnsweredQuestion: (questionId: string, answer: any) => void;

  // Eligibility results
  eligibleSchemes: Scheme[];
  setEligibleSchemes: (schemes: Scheme[]) => void;

  // Selected schemes for optimization
  selectedSchemes: Scheme[];
  setSelectedSchemes: (schemes: Scheme[]) => void;
  toggleSchemeSelection: (scheme: Scheme) => void;

  // Optimized portfolio
  optimizedPortfolio: OptimizedPortfolio | null;
  setOptimizedPortfolio: (portfolio: OptimizedPortfolio | null) => void;

  // Journey plan
  journeyPlan: JourneyPlan | null;
  setJourneyPlan: (plan: JourneyPlan | null) => void;

  // UI preferences
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;

  // Current page/step tracking
  currentStep: 'home' | 'questions' | 'results' | 'journey' | 'detail' | 'graph';
  setCurrentStep: (step: AppState['currentStep']) => void;

  // Active scheme detail
  activeSchemeId: string | null;
  setActiveSchemeId: (schemeId: string | null) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Reset entire state
  resetState: () => void;
}

// Initial state values
const initialState = {
  userAttributes: {},
  currentQuestionIndex: 0,
  answeredQuestions: {},
  eligibleSchemes: [],
  selectedSchemes: [],
  optimizedPortfolio: null,
  journeyPlan: null,
  language: 'en' as const,
  darkMode: false,
  currentStep: 'home' as const,
  activeSchemeId: null,
  isLoading: false,
};

// Create the store with persistence
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // User attributes management
      setUserAttributes: (attributes) =>
        set({ userAttributes: attributes }),

      updateUserAttribute: (key, value) =>
        set((state) => ({
          userAttributes: { ...state.userAttributes, [key]: value },
        })),

      clearUserAttributes: () =>
        set({ userAttributes: {} }),

      // Question flow management
      setCurrentQuestionIndex: (index) =>
        set({ currentQuestionIndex: index }),

      setAnsweredQuestion: (questionId, answer) =>
        set((state) => ({
          answeredQuestions: { ...state.answeredQuestions, [questionId]: answer },
        })),

      // Eligibility results
      setEligibleSchemes: (schemes) =>
        set({ eligibleSchemes: schemes }),

      // Scheme selection
      setSelectedSchemes: (schemes) =>
        set({ selectedSchemes: schemes }),

      toggleSchemeSelection: (scheme) =>
        set((state) => {
          const isSelected = state.selectedSchemes.some((s) => s.id === scheme.id);
          return {
            selectedSchemes: isSelected
              ? state.selectedSchemes.filter((s) => s.id !== scheme.id)
              : [...state.selectedSchemes, scheme],
          };
        }),

      // Optimized portfolio
      setOptimizedPortfolio: (portfolio) =>
        set({ optimizedPortfolio: portfolio }),

      // Journey plan
      setJourneyPlan: (plan) =>
        set({ journeyPlan: plan }),

      // UI preferences
      setLanguage: (lang) =>
        set({ language: lang }),

      setDarkMode: (enabled) => {
        set({ darkMode: enabled });
        // Update document class for Tailwind dark mode
        if (typeof window !== 'undefined') {
          if (enabled) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },

      // Navigation
      setCurrentStep: (step) =>
        set({ currentStep: step }),

      setActiveSchemeId: (schemeId) =>
        set({ activeSchemeId: schemeId }),

      // Loading state
      setIsLoading: (loading) =>
        set({ isLoading: loading }),

      // Reset everything
      resetState: () =>
        set(initialState),
    }),
    {
      name: 'yojanahub-storage', // localStorage key
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      ),
      // Only persist certain fields (don't persist loading states)
      partialize: (state) => ({
        userAttributes: state.userAttributes,
        answeredQuestions: state.answeredQuestions,
        eligibleSchemes: state.eligibleSchemes,
        selectedSchemes: state.selectedSchemes,
        optimizedPortfolio: state.optimizedPortfolio,
        journeyPlan: state.journeyPlan,
        language: state.language,
        darkMode: state.darkMode,
        currentStep: state.currentStep,
        currentQuestionIndex: state.currentQuestionIndex,
      }),
      skipHydration: false,
    }
  )
);

// Selector hooks for better performance
export const useUserAttributes = () => useAppStore((state) => state.userAttributes);
export const useEligibleSchemes = () => useAppStore((state) => state.eligibleSchemes);
export const useSelectedSchemes = () => useAppStore((state) => state.selectedSchemes);
export const useJourneyPlan = () => useAppStore((state) => state.journeyPlan);
export const useLanguage = () => useAppStore((state) => state.language);
export const useDarkMode = () => useAppStore((state) => state.darkMode);
export const useCurrentStep = () => useAppStore((state) => state.currentStep);
export const useIsLoading = () => useAppStore((state) => state.isLoading);

// Hydration hook to prevent SSR mismatch
export const useHydration = () => {
  const [hydrated, setHydrated] = React.useState(false);
  
  React.useEffect(() => {
    setHydrated(true);
  }, []);
  
  return hydrated;
};
