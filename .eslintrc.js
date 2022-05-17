module.exports = {
  plugins: ["prettier", "import", "react"],
  env: {
    node: true,
    browser: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    "plugin:import/errors",
    "plugin:import/warnings",
    'plugin:prettier/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: 'babel-eslint',
  rules: {
    // Plugins
    "import/prefer-default-export": "off",
    // "import/no-dynamic-require": "off",
    "import/named": "error",
    "import/no-unresolved": "off",
    "import/namespace": "warn",
    // "import/no-named-as-default": "off",
    "import/export": "warn",
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "parent", "sibling", "index"],
        "newlines-between": "always"
      }
    ],
    // React
    'react/prop-types': 0,
    'react/jsx-no-undef': ['error', { allowGlobals: true }],

    // Possible Errors
    "prettier/prettier": "off",
    "no-console": "off",

    // Best Practices
    "no-multi-spaces": ["error", { "ignoreEOLComments": true }],
    "no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1}],
    "indent": ["error", 2],

    // Variables
    "no-multi-assign": 1,
    "no-param-reassign": 1,
    // no-restricted-globals

    // Node.js and CommonJS

    // Stylistic Issues
    "max-len": "off",
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    "no-underscore-dangle": "off",
    "object-curly-newline": ["error", { "consistent": true }],
    "no-unused-vars": "off",
    "no-use-before-define": ["error", {"functions": false, "classes": false}],
    "consistent-return": "off"
    // JS.Next
  },
  settings: {
    "react": {
      "version": "16.8"
    }
  }
};
