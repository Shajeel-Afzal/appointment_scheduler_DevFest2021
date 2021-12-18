module.exports = {
  root: true,
  "parserOptions": {
    // Required for certain syntax usages
    "ecmaVersion": 2019
  },
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
  ],
  rules: {
    quotes: "off",
    "no-unused-vars": "off",        
  },
};
