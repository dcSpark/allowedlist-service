module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: './tsconfig.typecheck.json',
      ecmaVersion: 'es2019',
      sourceType: 'module',
      tsconfigRootDir: __dirname,
      ecmaFeatures: {
        legacyDecorators: true,
      },
    },
    extends: [
      'airbnb-typescript/base',
      "plugin:@typescript-eslint/recommended",
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'plugin:import/typescript',
      'prettier',
    ],
    env: {
      node: true,
    },
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/dot-notation': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        }
      ],
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-redeclare': 'off', // causes issues with if/else blocks
      '@typescript-eslint/no-shadow': 'off', // causes issues with if/else blocks
      '@typescript-eslint/no-inferrable-types': 'off', // pointlessly strict I think
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: null,
          leadingUnderscore: 'allow',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
          leadingUnderscore: 'allow',
        },
      ],
      '@typescript-eslint/return-await': [
        'error',
        'always',
      ],
      'func-names': 'off',
      'new-cap': 'off',
      'arrow-parens': ['off'],
      'consistent-return': 'off',
      'comma-dangle': 'off',
      'generator-star-spacing': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-dynamic-require': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/prefer-default-export': 'off',
      'import/order': 'off',
      'jest/no-conditional-expect': 'off',
      '@typescript-eslint/lines-between-class-members': 'off',
      'no-else-return': 'off',
      'no-multiple-empty-lines': 'off',
      'no-multi-spaces': 'off',
      'no-restricted-imports': [
        "error",
        { paths: [
          {
            name: "react-router-dom",
            importNames: ["useLocation", "useHistory"],
            message: "Use hookts.ts instead"
          },
          {
            name: "react-redux",
            importNames: ["useDispatch", "useSelector"],
            message: "Use hookts.ts instead"
          },
        ]}
      ],
      'no-restricted-globals': 'off',
      'no-restricted-syntax': 'off',
      'no-return-await': 'off',
      'no-use-before-define': 'off',
      'object-curly-newline': 'off',
      'operator-linebreak': 0,
      'prefer-destructuring': 0,
      'promise/param-names': 2,
      'promise/always-return': 2,
      'promise/catch-or-return': 0,
      'promise/no-native': 0,
      'class-methods-use-this': 0,
      'no-continue': 0,
      'no-duplicate-imports': 0,
      'no-param-reassign': 0,
      'no-plusplus': 0,
      'no-bitwise': 0,
      'no-underscore-dangle': 0,
      'no-console': 0,
      'no-mixed-operators': 0,
      'no-multi-assign': 0,
      'no-unneeded-ternary': ['error', { defaultAssignment: true }],
      'un-undef-init': 0, // this rule can screw up type inference
      'no-void': ["error", {
        // useful to use an explicit void when ignore a floating promise
        "allowAsStatement": true
      }],
      'prefer-template': 0,
      'no-trailing-spaces': 1,
      'padded-blocks': 0,
      'arrow-body-style': 0,
      'key-spacing': 1,
      'no-empty-function': 1,
      'max-len': 0,
      'no-useless-escape': 1,
      'prefer-const': 'off', // causes issues with let statements followed by block or try-catch
      'object-curly-spacing': 1,
      'spaced-comment': 1,
      'import/imports-first': 1,
      'react/jsx-indent': 1,
      'global-require': 'off',
      'no-await-in-loop': 0,
      'no-unused-expressions': 0,
      'no-lone-blocks': 0,
      'max-classes-per-file': 0,
    },
    ignorePatterns: ['.eslintrc.js'],
    plugins: ['@typescript-eslint', 'import', 'promise', 'prettier'],
    globals: {
    },
  };
  