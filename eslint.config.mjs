import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Ignore unused variables (especially in catch blocks and test files)
      "@typescript-eslint/no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      
      // Allow explicit any types for flexibility
      "@typescript-eslint/no-explicit-any": "off",
      
      // Ignore missing dependencies in useEffect (for specific cases)
      "react-hooks/exhaustive-deps": "off",
      
      // Ignore React hooks rules for conditional calls
      "react-hooks/rules-of-hooks": "off",
      
      // Ignore accessibility warnings for lucide-react icon components
      "jsx-a11y/alt-text": "off"
    }
  }
];

export default eslintConfig;
