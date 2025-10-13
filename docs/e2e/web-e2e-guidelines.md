# Web E2E Testing Guidelines

This document outlines the best practices and standards for writing end-to-end tests for the NestWise web application using Playwright and Mock Service Worker (MSW).

## Core Principles

### 1. Clarity

**Test names should describe the user outcome, not implementation details.**

✅ **Good Examples:**

- `user can view their monthly budget progress`
- `user sees spending breakdown by category`
- `user receives error message when budget exceeds limit`

❌ **Bad Examples:**

- `spending-vs-target-card renders`
- `api call succeeds`
- `component has correct props`

**Guidelines:**

- Use descriptive test names that explain what the user is doing or seeing
- Focus on user-facing behavior, not internal implementation
- Write tests that could be understood by non-technical stakeholders

### 2. AAA Pattern (Arrange, Act, Assert)

**Tests should follow the Arrange-Act-Assert structure for clarity and consistency.**

```typescript
test('user can view their monthly budget progress', async ({page}) => {
  // Arrange: Set up the initial state
  await page.goto('/plan');

  // Act: Perform the action (navigation/interaction)
  await page.waitForLoadState('networkidle');

  // Assert: Verify the expected outcome
  await expect(page.getByTestId('spending-amount')).toHaveText('$400.00');
  await expect(page.getByTestId('budget-target')).toHaveText('$1,000.00');
});
```

**Guidelines:**

- Separate test setup (arrange), user actions (act), and verification (assert) with comments or blank lines
- Keep each section focused on its purpose
- Avoid mixing actions and assertions

### 3. Isolation

**Tests must be independent with no shared state between tests.**

✅ **Good Practice:**

- Each test can run in any order
- Tests don't rely on data or state from previous tests
- MSW handlers provide consistent mock data for each test

❌ **Bad Practice:**

- Tests that must run in a specific sequence
- Tests that modify global state
- Tests that depend on side effects from other tests

**Guidelines:**

- Use `test.describe` blocks to group related tests logically
- Reset any modified state in `beforeEach` or `afterEach` hooks if needed
- Each test should start from a clean slate

### 4. Robustness

**Tests should be resilient and use reliable selectors.**

#### Selector Priority (in order of preference):

1. **`data-testid` attributes** (Highest priority)

   ```typescript
   await page.getByTestId('spending-vs-target-card');
   await page.getByTestId('spending-amount');
   ```

2. **Accessible selectors** (When appropriate)

   ```typescript
   await page.getByRole('button', {name: 'Edit Budget'});
   await page.getByLabel('Monthly Budget');
   ```

3. **Avoid:**
   - CSS class selectors (`.class-name`) - classes change frequently
   - Text content selectors (`text=value`) - text changes with i18n, formatting, or content updates
   - Complex CSS selectors - brittle and hard to maintain

**Guidelines:**

- Add `data-testid` attributes to all interactive elements and key display components
- Use semantic HTML and ARIA attributes when possible
- Handle loading states with proper waits (see below)

#### Handling Waits Correctly

```typescript
// ✅ Good: Wait for specific elements
await page.getByTestId('spending-amount').waitFor({state: 'visible'});

// ✅ Good: Use Playwright's auto-waiting with assertions
await expect(page.getByTestId('spending-amount')).toBeVisible();

// ✅ Good: Wait for network to settle
await page.waitForLoadState('networkidle');

// ❌ Bad: Arbitrary timeouts
await page.waitForTimeout(1000);
```

### 5. Readability

**Test code should be clean, well-organized, and easy to understand.**

**Guidelines:**

- Use descriptive variable names
- Extract complex selectors into well-named constants or helper functions
- Keep test logic simple and linear
- Add comments only when the intent isn't obvious from the code
- Group related assertions together
- Use blank lines to separate logical sections

**Example:**

```typescript
test('user sees accurate budget calculations', async ({page}) => {
  // Navigate to plan page
  await page.goto('/plan');

  // Verify spending display
  const spendingCard = page.getByTestId('spending-vs-target-card');
  await expect(spendingCard.getByTestId('spending-amount')).toHaveText('$400.00');
  await expect(spendingCard.getByTestId('budget-target')).toHaveText('$1,000.00');

  // Verify progress indicators
  await expect(spendingCard.getByTestId('progress-percentage')).toHaveText('40.0%');
  await expect(spendingCard.getByTestId('remaining-amount')).toHaveText('$600.00');
});
```

### 6. Relevance

**Tests should focus on high-value, critical user paths.**

**Priority User Flows:**

1. Authentication and authorization
2. Core business workflows (budget planning, transaction logging)
3. Data visualization and reporting
4. Critical user interactions (create, update, delete operations)
5. Error states and validation

**Guidelines:**

- Focus on happy paths and critical error scenarios
- Don't test every edge case in E2E - save those for unit/integration tests
- Test user-facing features, not internal implementation
- Prioritize tests that protect revenue or user trust
- Balance coverage with execution speed

## MSW Mock Data Alignment

All tests must align with the mock data defined in MSW handlers. Here's the current mock data structure:

### Mock User & Household

```typescript
// User: 'testuser' with household 'h-1'
// Monthly Budget: $1,000.00 (100000 cents)
```

### Mock Transactions

```typescript
// Total Expenses: $400.00
// - Groceries: $250.00 (transaction t-1)
// - Utilities: $150.00 (transaction t-2)
```

### Mock Category Budgets

```typescript
// Groceries (c-1): $300.00 planned, $250.00 spent
// Utilities (c-2): $200.00 planned, $150.00 spent
// Total Planned: $500.00
```

### Expected Calculations

```typescript
// Spending Progress: 40.0% ($400 / $1000)
// Remaining Budget: $600.00 ($1000 - $400)
```

**Guidelines:**

- Keep mock data simple and consistent
- Update tests when mock data changes
- Document any special mock data scenarios in test comments
- Use realistic data that represents actual user scenarios

## Test Organization

```
apps/web/
├── e2e/
│   ├── plan.spec.ts              # Plan page E2E tests
│   ├── transactions.spec.ts      # Future: Transaction E2E tests
│   └── auth.spec.ts              # Future: Authentication E2E tests
├── src/
│   └── modules/
│       └── [module]/
│           └── mocks/
│               └── handlers.ts   # MSW handlers for module
└── playwright.config.ts
```

## Example Test Template

```typescript
import {test, expect} from '@playwright/test';

test.describe('Feature Name', () => {
  test('user can [perform action and see expected outcome]', async ({page}) => {
    // Arrange: Navigate to the page
    await page.goto('/path');

    // Act: Perform user actions
    await page.getByTestId('action-button').click();

    // Assert: Verify expected outcomes
    await expect(page.getByTestId('result-element')).toBeVisible();
    await expect(page.getByTestId('result-element')).toHaveText('Expected Text');
  });
});
```

## Common Patterns

### Waiting for Page Load

```typescript
await page.goto('/plan');
await page.waitForLoadState('networkidle');
```

### Testing Data Display

```typescript
const card = page.getByTestId('spending-vs-target-card');
await expect(card.getByTestId('spending-amount')).toHaveText('$400.00');
```

### Testing User Interactions

```typescript
await page.getByTestId('edit-budget-button').click();
await page.getByTestId('budget-input').fill('2000');
await page.getByTestId('save-button').click();
await expect(page.getByTestId('budget-target')).toHaveText('$2,000.00');
```

### Testing Lists and Tables

```typescript
const budgetList = page.getByTestId('category-budgets-list');
await expect(budgetList.getByTestId('category-budget-item')).toHaveCount(2);
```

## Running E2E Tests

```bash
# Install Playwright browsers (first time only)
pnpm --filter @nest-wise/web e2e:install

# Run all E2E tests
pnpm --filter @nest-wise/web e2e

# Run tests in headed mode (see browser)
pnpm --filter @nest-wise/web e2e:headed

# Run tests in UI mode (interactive)
pnpm --filter @nest-wise/web e2e:ui

# Run specific test file
pnpm --filter @nest-wise/web e2e plan.spec.ts
```

## Debugging Tests

### Using Playwright Inspector

```bash
PWDEBUG=1 pnpm --filter @nest-wise/web e2e
```

### Taking Screenshots on Failure

Already configured in `playwright.config.ts` - screenshots are automatically taken on test failures.

### Viewing Test Reports

```bash
pnpm --filter @nest-wise/web playwright show-report
```

## Best Practices Summary

1. ✅ Use `data-testid` for all test selectors
2. ✅ Write tests from the user's perspective
3. ✅ Follow AAA pattern (Arrange, Act, Assert)
4. ✅ Keep tests independent and isolated
5. ✅ Use descriptive test names
6. ✅ Focus on critical user paths
7. ✅ Align tests with MSW mock data
8. ✅ Use Playwright's built-in waiting mechanisms
9. ✅ Keep tests readable and maintainable
10. ✅ Update tests when mock data changes

## Anti-Patterns to Avoid

1. ❌ Using CSS class selectors (`.btn-primary`)
2. ❌ Using text content selectors (`text=Submit`)
3. ❌ Arbitrary timeouts (`waitForTimeout(1000)`)
4. ❌ Tests that depend on each other
5. ❌ Testing implementation details
6. ❌ Overly complex test setup
7. ❌ Tests that are flaky or unreliable
8. ❌ Testing every edge case in E2E

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [MSW Documentation](https://mswjs.io/)
- [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles/)
