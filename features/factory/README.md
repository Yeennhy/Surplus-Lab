# Factory Engine (M5)

`features/factory` is a pure TypeScript module. It has no UI clock or React state.
M4 owns the chapter 3 controls and calls `getFactorySnapshot(config, hour)` as its
clock advances; M6 reads `getFactoryResult(config)` for chapter 4.

```ts
import {
  TEXTBOOK_FACTORY_CONFIG,
  getFactoryResult,
  getFactorySnapshot,
  startFactory,
} from "@/features/factory";

const setup = { cottonReady: true, machineReady: true, laborHired: true };
const initial = startFactory(TEXTBOOK_FACTORY_CONFIG, setup);
const checkpoint = getFactorySnapshot(TEXTBOOK_FACTORY_CONFIG, 4);
const result = getFactoryResult(TEXTBOOK_FACTORY_CONFIG);
```

`startFactory` throws `FactoryInputError` with an `issues` array if an input is
invalid or a resource is missing. The UI can call `validateFactoryConfig` and
`validateFactorySetup` first to show field-level feedback. `startFactory` returns
hour zero; restart means resetting the UI clock to zero and calling it again.
The UI must stop at `snapshot.isCheckpoint`, ask whether surplus has appeared,
then resume after the answer. The engine does not advance time automatically.

## Textbook values and meaning

| Hour | c transferred | New value | v reproduced | m | Produced G | Capital committed for shift |
|---:|---:|---:|---:|---:|---:|---:|
| 0 | 0 | 0 | 0 | 0 | 0 | 121 |
| 4 | 53 | 15 | 15 | 0 | 68 | 121 |
| 8 | 106 | 30 | 15 | 15 | 136 | 121 |

`capitalAdvancedTotal` is the 121 USD committed to the entire shift; it is not
the product value at hour zero. `capitalUsedThroughHour` is 68 at hour four and
121 at hour eight. The labor power cost is paid once for the full shift.

Intermediate hours use linear interpolation to support animation; only 0, 4
and 8 hours are textbook checkpoints. At hour six the Figma frame
[`63:11686`](https://www.figma.com/design/kayt251aAMFYmoWHqNMno4/Project-KTCT?node-id=63-11686&m=dev)
shows full-shift `c = 106`, full-shift `v = 15`, accrued `m = 7.5` and
`G = 128.5`. This combines full-shift inputs with surplus accrued by hour six.
The engine exposes that **illustration** as `illustrativeFullInputValue`; the
value of output actually produced through hour six is `productValue = 102`.
These values need distinct UI labels. The exact 4-hour and 8-hour checkpoints
come from the project module contract and textbook extract.

The matching Figma frames are setup `55:7339`/`63:11317`, hour zero
`55:7695`, checkpoint `44:3500`/`57:8223`/`63:12064`, hour eight
`57:8579`, and result `44:3861`/`63:12805`. This module supplies their data;
M4 owns their visual implementation and interaction.
