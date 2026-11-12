export {
  DEFAULT_FACTORY_CONFIG,
  EMPTY_FACTORY_SETUP,
  FactoryInputError,
  TEXTBOOK_FACTORY_CONFIG,
  calculateFactoryResult,
  calculateFactorySnapshot,
  getFactoryResult,
  getFactorySnapshot,
  normalizeFactoryConfig,
  startFactory,
  validateFactoryConfig,
  validateFactorySetup,
} from "./engine";

export type {
  FactoryConfig,
  FactoryStage,
  CheckpointAnswer,
  FactoryResourceItem,
  FactoryIssue,
  FactoryIssueCode,
  FactoryPhase,
  FactoryResult,
  FactorySetup,
  FactorySnapshot,
} from "./types";

export { FACTORY_RESOURCES } from "./types";

export { diagnoseLine, getShiftLedger, simulateBatch, validateBatchPlan } from "./gameplay";
export type { BatchIssue, BatchIssueCode, BatchLedger, BatchPlan, LineConfiguration, LineStation, ProductionEvent, ProductionEventType, ShiftLedger } from "./gameplay";
