/** Values for one production shift, in USD unless the name says hours. */
export interface FactoryConfig {
  totalHours: number;
  necessaryHours: number;
  cottonValue: number;
  machineDepreciation: number;
  laborPowerValue: number;
  newValueTotal: number;
}

/** The three resources shown on the preparation screen. */
export interface FactorySetup {
  cottonReady: boolean;
  machineReady: boolean;
  laborHired: boolean;
}

export type FactoryPhase = "ready" | "necessary-labor" | "checkpoint" | "surplus-labor" | "complete";

export interface FactorySnapshot {
  hour: number;
  phase: FactoryPhase;
  isCheckpoint: boolean;
  isComplete: boolean;
  /** Capital committed to the entire shift, even at hour zero. */
  capitalAdvancedTotal: number;
  /** Value already used by the output produced through this hour. */
  capitalUsedThroughHour: number;
  cottonTransferred: number;
  machineTransferred: number;
  /** Constant capital transferred into output through this hour. */
  transferredValue: number;
  /** Value newly created by labor through this hour. */
  newValue: number;
  /** Portion of new value that has reproduced the cost of labor power. */
  variableCapital: number;
  surplusValue: number;
  /** Value of the output already produced, not a full-shift projection. */
  productValue: number;
  /** Full-shift c + full-shift v + surplus accrued so far; an illustration only. */
  illustrativeFullInputValue: number;
  /** Intermediate hours are linearly interpolated for the animation. */
  isInterpolated: boolean;
}

export interface FactoryResult {
  constantCapital: number;
  variableCapital: number;
  surplusValue: number;
  newValue: number;
  productValue: number;
  capitalAdvancedTotal: number;
  necessaryHours: number;
  surplusHours: number;
  checkpoint: FactorySnapshot;
  completion: FactorySnapshot;
}

export type FactoryIssueCode =
  | "invalid-number"
  | "invalid-hours"
  | "inconsistent-necessary-hours"
  | "resource-not-ready"
  | "hour-out-of-range";

export interface FactoryIssue {
  code: FactoryIssueCode;
  field: keyof FactoryConfig | keyof FactorySetup | "hour";
  message: string;
}
