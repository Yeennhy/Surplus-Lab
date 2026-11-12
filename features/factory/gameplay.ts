import { getFactorySnapshot, TEXTBOOK_FACTORY_CONFIG } from "./engine";
import type { FactoryConfig } from "./types";

export interface BatchPlan {
  cotton: number;
  depreciation: number;
  laborCharge: number;
}

export type LineStation = "opener" | "rollers" | "worker" | "spool";
export interface LineConfiguration {
  openedCotton: boolean;
  fiberToRollers: boolean;
  rollersToWorker: boolean;
  workerToSpool: boolean;
}

export interface BatchLedger {
  number: 1 | 2;
  fromHour: number;
  toHour: number;
  cotton: number;
  depreciation: number;
  laborCharge: number;
  oldValue: number;
  newValue: number;
  productValue: number;
  surplusAtEnd: number;
}

export interface ShiftLedger {
  contract: { laborPowerValue: number; hours: number };
  batches: [BatchLedger, BatchLedger];
  totals: { c: number; v: number; m: number; capitalAdvanced: number; productValue: number };
}

export type ProductionEventType = "COTTON_ALLOCATED" | "FIBERS_SPLIT" | "MACHINE_SPINNING" | "WORKER_PROCESSING" | "TRIAL_PASSED" | "LINE_BLOCKED" | "INVOICE_REJECTED";
export interface ProductionEvent { type: ProductionEventType; station: LineStation | "invoice"; message: string }

export type BatchIssueCode = "cotton" | "depreciation" | "missing-contract" | "duplicate-wage";
export interface BatchIssue { code: BatchIssueCode; message: string }

/** Compare a player's invoice with the textbook production order, without mutating it. */
export function validateBatchPlan(plan: BatchPlan, batch: 1 | 2, config: FactoryConfig = TEXTBOOK_FACTORY_CONFIG): BatchIssue[] {
  const issues: BatchIssue[] = [];
  const first = getFactorySnapshot(config, config.necessaryHours);
  const last = getFactorySnapshot(config, config.totalHours);
  const expectedCotton = batch === 1 ? first.cottonTransferred : last.cottonTransferred - first.cottonTransferred;
  const expectedDepreciation = batch === 1 ? first.machineTransferred : last.machineTransferred - first.machineTransferred;
  if (plan.cotton !== expectedCotton) issues.push({ code: "cotton", message: `Mẻ ${batch} cần ${expectedCotton} USD bông; sợi sẽ đứt nếu cấp thiếu hoặc ghi sai phiếu.` });
  if (plan.depreciation !== expectedDepreciation) issues.push({ code: "depreciation", message: `Mẻ ${batch} cần ghi ${expectedDepreciation} USD hao mòn máy.` });
  if (batch === 1 && plan.laborCharge !== config.laborPowerValue) issues.push({ code: "missing-contract", message: `Hợp đồng ${config.totalHours} giờ trị giá ${config.laborPowerValue} USD phải được ứng trước một lần.` });
  if (batch === 2 && plan.laborCharge !== 0) issues.push({ code: "duplicate-wage", message: `Hợp đồng ${config.totalHours} giờ vẫn còn hiệu lực. Không ghi thêm v cho mẻ thứ hai.` });
  return issues;
}

/** A trial creates an ordered, explainable event trace for the physical scene. */
export function simulateBatch(plan: BatchPlan, line: LineConfiguration, batch: 1 | 2, config: FactoryConfig = TEXTBOOK_FACTORY_CONFIG) {
  const issues = validateBatchPlan(plan, batch, config);
  if (issues.length) return { ready: false, events: [{ type: "INVOICE_REJECTED" as const, station: "invoice" as const, message: issues.map((issue) => issue.message).join(" ") }] };
  const events: ProductionEvent[] = [
    { type: "COTTON_ALLOCATED", station: "opener", message: `${plan.cotton} USD bông đã tới bộ mở xơ.` },
  ];
  const stages: Array<{ key: keyof LineConfiguration; station: LineStation; type: ProductionEventType; message: string }> = [
    { key: "openedCotton", station: "opener", type: "FIBERS_SPLIT", message: "Bông được mở thành nhiều dải xơ riêng." },
    { key: "fiberToRollers", station: "rollers", type: "MACHINE_SPINNING", message: "Các dải xơ đi qua con lăn và được kéo thành sợi." },
    { key: "rollersToWorker", station: "worker", type: "WORKER_PROCESSING", message: "Công nhân tiếp nhận, kiểm và gia công sợi." },
    { key: "workerToSpool", station: "spool", type: "TRIAL_PASSED", message: "Sợi thử đã tới cuộn; đường đi thông suốt, sẵn sàng sản xuất mẻ." },
  ];
  for (const stage of stages) {
    if (!line[stage.key]) {
      events.push({ type: "LINE_BLOCKED", station: stage.station, message: diagnoseLine(line)?.message ?? "Dây chuyền bị nghẽn." });
      return { ready: false, events };
    }
    events.push({ type: stage.type, station: stage.station, message: stage.message });
  }
  return { ready: true, events };
}

/** The first blocked physical station determines the visible trial-run diagnosis. */
export function diagnoseLine(line: LineConfiguration): { station: LineStation; message: string } | null {
  if (!line.openedCotton) return { station: "opener", message: "Bông còn nguyên trong kho. Mở và tách thành xơ trước." };
  if (!line.fiberToRollers) return { station: "rollers", message: "Xơ đã tách nhưng chưa đi vào con lăn; máy quay rỗng, chưa có sợi." };
  if (!line.rollersToWorker) return { station: "worker", message: "Máy đã kéo sợi nhưng chưa chuyển tới công nhân gia công." };
  if (!line.workerToSpool) return { station: "spool", message: "Công nhân đã gia công; cần đưa sợi tới cuộn thành phẩm." };
  return null;
}

export function getShiftLedger(config: FactoryConfig = TEXTBOOK_FACTORY_CONFIG): ShiftLedger {
  const first = getFactorySnapshot(config, config.necessaryHours);
  const last = getFactorySnapshot(config, config.totalHours);
  const batches: [BatchLedger, BatchLedger] = [
    {
      number: 1, fromHour: 0, toHour: config.necessaryHours,
      cotton: first.cottonTransferred, depreciation: first.machineTransferred,
      laborCharge: config.laborPowerValue, oldValue: first.transferredValue,
      newValue: first.newValue, productValue: first.productValue, surplusAtEnd: first.surplusValue,
    },
    {
      number: 2, fromHour: config.necessaryHours, toHour: config.totalHours,
      cotton: last.cottonTransferred - first.cottonTransferred,
      depreciation: last.machineTransferred - first.machineTransferred,
      laborCharge: 0, oldValue: last.transferredValue - first.transferredValue,
      newValue: last.newValue - first.newValue,
      productValue: last.productValue - first.productValue, surplusAtEnd: last.surplusValue,
    },
  ];
  return {
    contract: { laborPowerValue: config.laborPowerValue, hours: config.totalHours },
    batches,
    totals: {
      c: last.transferredValue, v: config.laborPowerValue, m: last.surplusValue,
      capitalAdvanced: last.capitalAdvancedTotal, productValue: last.productValue,
    },
  };
}
