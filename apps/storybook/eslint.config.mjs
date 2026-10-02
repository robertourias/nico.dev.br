import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import baseConfig from "@nico.dev/config/eslint/base";

const eslintConfig = defineConfig([
  ...baseConfig,
  ...tseslint.configs.recommended,
  globalIgnores(["storybook-static/**", "node_modules/**"]),
]);

export default eslintConfig;
