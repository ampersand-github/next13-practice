module.exports = {
  parserOptions: {
    project: "./tsconfig.json",
  },
  extends: [
    "next/core-web-vitals",
    "prettier",
    "plugin:storybook/recommended",
    "plugin:import/typescript",
  ],
  plugins: ["import-access"],
  rules: {
    "import-access/jsdoc": ["error"],
  },
};
