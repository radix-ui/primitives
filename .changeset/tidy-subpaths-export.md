---
"radix-ui": patch
---

Added per-primitive subpath entry points so each primitive can be imported directly, eg. `import { Accordion } from 'radix-ui/accordion'` or `import * as Accordion from 'radix-ui/accordion'`. This mirrors the namespaced exports available from the root `radix-ui` entry point.
