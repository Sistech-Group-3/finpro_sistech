import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local ML-service artifacts (uv venv, python bytecode, egg-info).
    "ml-service/.venv/**",
    "ml-service/**/__pycache__/**",
    "ml-service/mlops.egg-info/**",
  ]),
]);

export default eslintConfig;
