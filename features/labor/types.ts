/**
 * Type definitions for Task M6 - Chapter 2: The Special Commodity (Hàng hóa Sức lao động)
 * References: Bộ GD&ĐT (2021), Giáo trình Kinh tế chính trị Mác – Lênin, tr. 80–82
 */

export type Chapter2Step =
  | "intro"
  | "conditions"
  | "scenarios"
  | "attributes"
  | "value_components"
  | "summary";

export interface LaborCondition {
  id: "personal_freedom" | "lacks_means_of_production";
  number: 1 | 2;
  title: string;
  shortName: string;
  description: string;
  implications: string[];
  historicalContext: string;
}

export interface CharacterProfile {
  name: string;
  role: string;
  era: string;
  location: string;
  avatarIcon: string;
  description: string;
}

export interface LaborScenario {
  id: string;
  character: CharacterProfile;
  story: string;
  // Does this character satisfy condition 1 (personally free)?
  hasPersonalFreedom: boolean;
  freedomExplanation: string;
  // Does this character lack means of production?
  lacksMeansOfProduction: boolean;
  meansExplanation: string;
  // Can their labor power become a commodity? (True only if BOTH conditions are met)
  isCommodity: boolean;
  overallExplanation: string;
  historicalNote?: string;
}

export interface ScenarioAnswer {
  scenarioId: string;
  userSaidFree: boolean;
  userSaidLacksMeans: boolean;
  userSaidIsCommodity: boolean;
}

export interface ScenarioEvaluationResult {
  scenarioId: string;
  isCorrect: boolean;
  condition1Correct: boolean;
  condition2Correct: boolean;
  commodityConclusionCorrect: boolean;
  feedback: string;
}

export interface AttributeQuizQuestion {
  id: string;
  attributeType: "value" | "use_value";
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export type ValueComponentId = "living_costs" | "training_costs" | "child_rearing";

export interface ValueComponentDefinition {
  id: ValueComponentId;
  title: string;
  badgeNumber: number;
  description: string;
  examples: string[];
  socialSignificance: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    icon: string;
  };
}

export interface ValueComponentAnswer {
  itemId: string;
  componentId: ValueComponentId;
}

export interface Chapter2State {
  currentStep: Chapter2Step;
  currentScenarioIndex: number;
  scenarioAnswers: ScenarioAnswer[];
  attributeQuizAnswers: Record<string, number>;
  valueComponentAnswers: ValueComponentAnswer[];
  completed: boolean;
  score: number;
}

export interface Chapter2Result {
  score: number;
  totalQuestions: number;
  stars: 1 | 2 | 3;
  passed: boolean;
  scenarioScore: number;
  attributeScore: number;
  valueCompScore: number;
  badgeTitle: string;
  keyInsights: string[];
}
