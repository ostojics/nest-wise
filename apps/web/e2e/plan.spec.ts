import {test, expect} from '@playwright/test';

test.describe('Plan Page', () => {
  test('user can view their monthly budget progress', async ({page}) => {
    // Arrange: Navigate to plan page
    await page.goto('/plan');
    await page.waitForLoadState('networkidle');

    // Assert: Verify spending vs target card displays
    const spendingCard = page.getByTestId('spending-vs-target-card');
    await expect(spendingCard).toBeVisible();

    // Assert: Verify spending amount ($400.00 from mock: $250 Groceries + $150 Utilities)
    await expect(spendingCard.getByTestId('spending-amount')).toContainText('$400.00');

    // Assert: Verify budget target ($1,000.00 from mock user household)
    await expect(spendingCard.getByTestId('budget-target')).toContainText('$1,000.00');

    // Assert: Verify progress percentage (40% = $400/$1000)
    await expect(spendingCard.getByTestId('progress-percentage')).toContainText('40.0%');

    // Assert: Verify remaining budget ($600.00 = $1000 - $400)
    await expect(spendingCard.getByTestId('remaining-amount')).toContainText('$600.00');
  });

  test('user sees plan page instructions', async ({page}) => {
    // Arrange: Navigate to plan page
    await page.goto('/plan');
    await page.waitForLoadState('networkidle');

    // Assert: Verify page title is displayed
    await expect(page.getByTestId('plan-page-title')).toBeVisible();
    await expect(page.getByTestId('plan-page-title')).toContainText("Plan your household's spending by category");

    // Assert: Verify page description is displayed
    await expect(page.getByTestId('plan-page-description')).toBeVisible();
    await expect(page.getByTestId('plan-page-description')).toContainText('Set a planned amount for each category');
  });

  test('user sees category budgets summary', async ({page}) => {
    // Arrange: Navigate to plan page
    await page.goto('/plan');
    await page.waitForLoadState('networkidle');

    // Assert: Verify category budgets section is visible
    const budgetsSection = page.getByTestId('category-budgets-section');
    await expect(budgetsSection).toBeVisible();

    // Assert: Verify total planned amount ($500.00 = $300 Groceries + $200 Utilities from mock)
    await expect(budgetsSection.getByTestId('total-planned')).toContainText('$500.00');
  });
});
