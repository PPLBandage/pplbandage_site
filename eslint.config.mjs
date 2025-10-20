import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginJsonSchemaValidator from "eslint-plugin-json-schema-validator";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        ignores: ['.next/', 'out/'],
        rules: {
            "react-hooks/exhaustive-deps": "off",
            "@next/next/no-img-element": "off",
        },
    },
    ...eslintPluginJsonSchemaValidator.configs['flat/base'],
    {
        rules: {
            "json-schema-validator/no-invalid": [
                "error",
                {
                    "schemas": [
                        {
                            "fileMatch": ["src/constants/events.json"],
                            "schema": "src/constants/events.schema.json"
                        }
                    ]
                }
            ]
        }
    }
];

export default eslintConfig;
