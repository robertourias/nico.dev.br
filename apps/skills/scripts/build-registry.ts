// Entrypoint do registry: `tsx scripts/build-registry.ts [--root <dir>]`.
// Importado (testes, site) só reexporta buildRegistry; o CLI roda apenas quando executado diretamente.
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { main } from './registry/cli';

export { buildRegistry } from './registry/build';

const isDirectRun =
  process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  void main();
}
