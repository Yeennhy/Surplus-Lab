/**
 * Type definitions for Task M6 - Chapter 4: Anatomy of Value (Cơ cấu Giá trị Hàng hóa)
 * References: Bộ GD&ĐT (2021), Giáo trình Kinh tế chính trị Mác – Lênin, tr. 82–85
 */

export type Chapter4Step = "intro" | "classify" | "formula" | "comparison" | "summary";

export type CapitalCategory = "c" | "v" | "m";

export interface ValueCard {
  id: string;
  name: string;
  description: string;
  valueUSD: number;
  correctCategory: CapitalCategory;
  categoryLabel: string;
  icon: string;
  isAdvanceCapital: boolean; // TRUE for c and v; FALSE for m (surplus value)
  explanation: string;
}

export interface CategoryZone {
  category: CapitalCategory;
  symbol: string;
  title: string;
  subtitle: string;
  colorScheme: {
    bg: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    borderActive: string;
  };
  expectedCards: string[];
  totalExpectedUSD: number;
}

export interface ClassificationPlacement {
  cardId: string;
  assignedCategory: CapitalCategory;
}

export interface CardFeedback {
  cardId: string;
  isCorrect: boolean;
  assignedCategory: CapitalCategory;
  correctCategory: CapitalCategory;
  message: string;
  isMisclassifiedAdvanceCapital?: boolean;
}

export interface FormulaInput {
  c: number;
  v: number;
  m: number;
}

export interface FormulaValidationResult {
  cCorrect: boolean;
  vCorrect: boolean;
  mCorrect: boolean;
  sumCorrect: boolean;
  totalG: number;
  isFullyCorrect: boolean;
  message: string;
}

export interface Chapter4State {
  currentStep: Chapter4Step;
  placements: Record<string, CapitalCategory>;
  completed: boolean;
  score: number;
  mistakes: number;
}

export interface Chapter4Result {
  score: number;
  stars: 1 | 2 | 3;
  passed: boolean;
  cValue: number;
  vValue: number;
  mValue: number;
  totalG: number;
  badgeTitle: string;
  keyInsights: string[];
}
