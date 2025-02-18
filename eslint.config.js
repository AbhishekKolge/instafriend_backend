import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginSecurity from 'eslint-plugin-security';
import eslintPluginNode from 'eslint-plugin-node';
import eslintPluginJest from 'eslint-plugin-jest';
import eslintPluginPromise from 'eslint-plugin-promise';
import eslintPluginEslintComments from 'eslint-plugin-eslint-comments';
import eslintPluginSonarjs from 'eslint-plugin-sonarjs';
import eslintPluginNoUnsanitized from 'eslint-plugin-no-unsanitized';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'prettier': eslintPluginPrettier,
      'import': eslintPluginImport,
      'security': eslintPluginSecurity,
      'node': eslintPluginNode,
      'promise': eslintPluginPromise,
      'eslint-comments': eslintPluginEslintComments,
      'sonarjs': eslintPluginSonarjs,
      'no-unsanitized': eslintPluginNoUnsanitized,
    },
    rules: {
      ...tseslint.configs['recommended'].rules,
      ...eslintPluginPromise.configs.recommended.rules,
      ...eslintPluginEslintComments.configs.recommended.rules,
      ...eslintPluginSonarjs.configs.recommended.rules,
      ...eslintPluginNoUnsanitized.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'no-console': 'warn',
      'no-debugger': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'consistent-return': 'warn',
      'no-duplicate-imports': 'warn',
      'eqeqeq': 'warn',
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/no-duplicates': 'warn',
      'no-return-await': 'warn',
      'require-await': 'warn',
      'prettier/prettier': 'error',
      'no-undef': 'off',
      'no-shadow': 'warn',
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-fs-filename': 'warn',
      'security/detect-possible-timing-attacks': 'warn',
      'node/no-unpublished-import': 'error',
      'import/order': [
        'warn',
        {
          'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'never',
          'alphabetize': { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  {
    files: ['**/*.test.ts'],
    plugins: {
      jest: eslintPluginJest,
    },
    rules: {
      ...eslintPluginJest.configs['recommended'].rules,
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    },
  },
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/*.d.ts'],
  },
  {
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
          alwaysTryTypes: true,
        },
      },
    },
  },
];
