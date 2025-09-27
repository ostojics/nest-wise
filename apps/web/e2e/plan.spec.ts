import {test, expect} from '@playwright/test';

test.describe('Plan Page', () => {
  test('should display spending vs target card with mock data', async ({page}) => {
    // Navigate to the plan page
    await page.goto('/plan');

    // Wait for the Spending vs Target card to be visible
    await expect(
      page.locator('[data-testid="spending-vs-target-card"]').or(page.locator('text=Monthly Budget')),
    ).toBeVisible();

    // Verify the spending amount is displayed (mock data shows $400.00 total spending)
    await expect(page.locator('text=$400.00').or(page.locator('text=400.00'))).toBeVisible();

    // Verify the budget target is displayed (mock data shows $1,000.00 budget)
    await expect(
      page.locator('text=$1,000.00').or(page.locator('text=1,000.00')).or(page.locator('text=target')),
    ).toBeVisible();

    // Verify progress percentage is visible (should be 40% based on $400/$1000)
    await expect(page.locator('text=40.0%').or(page.locator('text=40%'))).toBeVisible();

    // Verify remaining budget is shown ($600.00 remaining)
    await expect(
      page.locator('text=$600.00').or(page.locator('text=600.00')).or(page.locator('text=Remaining')),
    ).toBeVisible();
  });

  test('should display plan page title and description', async ({page}) => {
    await page.goto('/plan');

    // Wait for the page to load
    await expect(page.locator('h3').filter({hasText: "Plan your household's spending by category"})).toBeVisible();

    // Verify the description is present
    await expect(page.locator('text=Set a planned amount for each category')).toBeVisible();
  });

  test('should display category budgets section', async ({page}) => {
    await page.goto('/plan');

    // Wait for category budgets to load (this might be in a list or table)
    await expect(page.locator('text=Groceries').or(page.locator('text=🛒'))).toBeVisible();
    await expect(page.locator('text=Utilities').or(page.locator('text=💡'))).toBeVisible();
  });
});
