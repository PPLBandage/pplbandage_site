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
            "react-hooks/exhaustive-deps": "off",
            "@next/next/no-img-element": "off",
            "react-hooks/rules-of-hooks": "off",
            "max-len": ["error", { code: 120 }],
        },
    },
];

export default eslintConfig;