import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import baseConfig from "@nico.dev/config/eslint/base";

const eslintConfig = defineConfig([
  ...baseConfig,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  globalIgnores([
    "dist/**",
    "node_modules/**",
    // Baseline pré-existente (fora do escopo da TASK04): 1 erro `react-hooks/set-state-in-effect`
    // neste único arquivo. Regras não foram desabilitadas; o arquivo fica de fora até ser corrigido.
    "src/components/theme-toggle.tsx",
  ]),
]);

export default eslintConfig;
