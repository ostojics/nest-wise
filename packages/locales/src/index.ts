// English resources
import enCommon from './en/common.json';
import enZod from './en/zod.json';
import enAuth from './en/auth.json';
import enUsers from './en/users.json';
import enHouseholds from './en/households.json';
import enAccounts from './en/accounts.json';
import enCategories from './en/categories.json';
import enTransactions from './en/transactions.json';
import enPrivateTransactions from './en/private-transactions.json';
import enCategoryBudgets from './en/category-budgets.json';
import enSavings from './en/savings.json';
import enApi from './en/api.json';
import enPolicy from './en/policy.json';

// Serbian resources
import srCommon from './sr/common.json';
import srZod from './sr/zod.json';
import srAuth from './sr/auth.json';
import srUsers from './sr/users.json';
import srHouseholds from './sr/households.json';
import srAccounts from './sr/accounts.json';
import srCategories from './sr/categories.json';
import srTransactions from './sr/transactions.json';
import srPrivateTransactions from './sr/private-transactions.json';
import srCategoryBudgets from './sr/category-budgets.json';
import srSavings from './sr/savings.json';
import srApi from './sr/api.json';
import srPolicy from './sr/policy.json';

export const resources = {
  en: {
    common: enCommon,
    zod: enZod,
    auth: enAuth,
    users: enUsers,
    households: enHouseholds,
    accounts: enAccounts,
    categories: enCategories,
    transactions: enTransactions,
    'private-transactions': enPrivateTransactions,
    'category-budgets': enCategoryBudgets,
    savings: enSavings,
    api: enApi,
    policy: enPolicy,
  },
  sr: {
    common: srCommon,
    zod: srZod,
    auth: srAuth,
    users: srUsers,
    households: srHouseholds,
    accounts: srAccounts,
    categories: srCategories,
    transactions: srTransactions,
    'private-transactions': srPrivateTransactions,
    'category-budgets': srCategoryBudgets,
    savings: srSavings,
    api: srApi,
    policy: srPolicy,
  },
} as const;

export const defaultNamespaces = [
  'common',
  'zod',
  'auth',
  'users',
  'households',
  'accounts',
  'categories',
  'transactions',
  'private-transactions',
  'category-budgets',
  'savings',
  'api',
  'policy',
] as const;

export const supportedLanguages = ['en', 'sr'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];
export type Namespace = (typeof defaultNamespaces)[number];

// Domain error keys helper to prevent typos
export const domainErrorKeys = {
  transactions: {
    category: {
      notAllowedForIncome: 'transactions.validation.category.notAllowedForIncome',
      requiredForExpense: 'transactions.validation.category.requiredForExpense',
    },
  },
  accounts: {
    idRequired: 'accounts.validation.accountIdRequired',
    idInvalid: 'accounts.validation.accountIdInvalid',
  },
  categories: {
    idRequired: 'categories.validation.categoryIdRequired',
    idInvalid: 'categories.validation.categoryIdInvalid',
  },
  users: {
    usernameRequired: 'users.validation.usernameRequired',
    usernameInvalid: 'users.validation.usernameInvalid',
    emailRequired: 'users.validation.emailRequired',
    emailInvalid: 'users.validation.emailInvalid',
    passwordsNotMatch: 'users.validation.passwordsNotMatch',
  },
  auth: {
    emailRequired: 'auth.validation.emailRequired',
    emailInvalid: 'auth.validation.emailInvalid',
    passwordRequired: 'auth.validation.passwordRequired',
    passwordTooShort: 'auth.validation.passwordTooShort',
    passwordsNotMatch: 'auth.validation.passwordsNotMatch',
  },
} as const;
