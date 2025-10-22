import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
    ignores: ['.next/', 'out/'],
    rules: {
        "react-hooks/exhaustive-deps": "off",
        "@next/next/no-img-element": "off",
        "react-hooks/set-state-in-effect": "off",
        "react-hooks/use-memo": "off"
    },
}];

export default eslintConfig;