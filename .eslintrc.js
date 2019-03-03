module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "module",
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  env: {
    node: true,
    jest: true
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  plugins: ["prettier"],
  rules: {
    curly: "error",
    eqeqeq: "error",
    "guard-for-in": "error",
    "linebreak-style": ["error", "unix"],
    "new-cap": [
      "error",
      {
        newIsCap: true,
        capIsNew: false,
        capIsNewExceptions: []
      }
    ],
    "no-bitwise": "error",
    "no-caller": "error",
    "no-cond-assign": "warn",
    "no-console": "off",
    "no-continue": "error",
    "no-debugger": "error",
    "no-dupe-keys": "error",
    "no-empty": "error",
    "no-eq-null": "error",
    "no-eval": "error",
    "no-lonely-if": "error",
    "no-nested-ternary": "error",
    "no-new": "warn",
    "no-new-object": "error",
    "no-undef": "error",
    "no-unneeded-ternary": ["error", { defaultAssignment: false }],
    "no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "none"
      }
    ],
    "no-use-before-define": [
      "error",
      {
        functions: false
      }
    ],
    "object-shorthand": [
      "error",
      "always",
      {
        ignoreConstructors: false,
        avoidQuotes: true
      }
    ],
    "one-var": ["error", "never"],
    "operator-assignment": ["error", "always"],
    "prefer-template": ["error"],
    "prettier/prettier": "error",
    strict: "warn"
  }
};
