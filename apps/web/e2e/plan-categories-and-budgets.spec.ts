import {test, expect} from '@playwright/test';

test.describe('Plan - Categories & Budgets', () => {
  test('user sees plan page with instructions', async ({page}) => {
    // Arrange: Navigate to Plan page
    await page.goto('/plan');
    await page.waitForLoadState('networkidle');

    // Assert: Page title is visible
    await expect(page.getByTestId('plan-page-title')).toBeVisible();
    await expect(page.getByTestId('plan-page-title')).toContainText('Planirajte troškove domaćinstva po kategorijama');

    // Assert: Page description is visible
    await expect(page.getByTestId('plan-page-description')).toBeVisible();
    await expect(page.getByTestId('plan-page-description')).toContainText(
      'Postavite planirani iznos za svaku kategoriju',
    );

    // Assert: "Nova kategorija" button is visible
    await expect(page.getByTestId('new-category-button')).toBeVisible();
  });

  test('user creates a new category', async ({page}) => {
    // Arrange: Navigate to Plan page
    await page.goto('/plan');
    await page.waitForLoadState('networkidle');

    // Act: Click "Nova kategorija" button
    await page.getByTestId('new-category-button').click();

    // Assert: Dialog opens
    await expect(page.getByTestId('new-category-dialog')).toBeVisible();

    // Act: Fill in category name input
    await page.getByTestId('category-name-input').fill('Hrana');

    // Wait for network request to complete before checking dialog state
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/categories') && response.request().method() === 'POST',
    );

    // Act: Submit the form
    await page.getByTestId('create-category-submit').click();
    await responsePromise;

    // Assert: Success toast message appears
    await expect(page.getByText('Kategorija je uspešno kreirana')).toBeVisible();

    // Assert: Dialog closes
    await expect(page.getByTestId('new-category-dialog')).not.toBeVisible({timeout: 10000});

    // Assert: New category "Hrana" appears in category budgets list
    await expect(page.getByTestId('budget-row-Hrana')).toBeVisible();
  });

  test('user sees existing category budgets', async ({page}) => {
    // Arrange: Navigate to Plan page
    await page.goto('/plan');

    // Act: Wait for page to load
    await page.waitForLoadState('networkidle');

    // Assert: Category budgets section is visible
    await expect(page.getByTestId('category-budgets-section')).toBeVisible();

    // Assert: "Groceries" category budget is visible
    const groceriesRow = page.getByTestId('budget-row-Groceries');
    await expect(groceriesRow).toBeVisible();

    // Assert: "Utilities" category budget is visible
    const utilitiesRow = page.getByTestId('budget-row-Utilities');
    await expect(utilitiesRow).toBeVisible();

    // Assert: Total planned amount is visible
    await expect(page.getByTestId('total-planned')).toBeVisible();
  });

  test('user edits a category budget planned amount', async ({page}) => {
    // Arrange: Navigate to Plan page and wait for budgets to load
    await page.goto('/plan');
    await page.waitForLoadState('networkidle');

    // Find the Groceries budget row
    const groceriesRow = page.getByTestId('budget-row-Groceries');
    await expect(groceriesRow).toBeVisible();

    // Act: Click "Dodeli" button for Groceries
    await groceriesRow.getByTestId('edit-budget-button-550e8400-e29b-41d4-a716-446655440008').click();

    // Assert: Edit budget dialog opens
    await expect(page.getByTestId('edit-budget-dialog')).toBeVisible();

    // Act: Fill in new planned amount
    await page.getByTestId('planned-amount-input').fill('50000');

    // Wait for network request to complete
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/category-budgets/') && response.request().method() === 'PATCH',
    );

    // Act: Submit the form
    await page.getByTestId('edit-budget-submit').click();
    await responsePromise;

    // Assert: Success toast message appears
    await expect(page.getByText('Budžet kategorije je uspešno ažuriran')).toBeVisible();

    // Assert: Dialog closes
    await expect(page.getByTestId('edit-budget-dialog')).not.toBeVisible({timeout: 10000});
  });

  test('user creates category and sets budget (combined flow)', async ({page}) => {
    // Arrange: Navigate to Plan page
    await page.goto('/plan');
    await page.waitForLoadState('networkidle');

    // Act: Create a new category "Transport"
    await page.getByTestId('new-category-button').click();
    await expect(page.getByTestId('new-category-dialog')).toBeVisible();
    await page.getByTestId('category-name-input').fill('Transport');

    const createResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/categories') && response.request().method() === 'POST',
    );
    await page.getByTestId('create-category-submit').click();
    await createResponsePromise;

    // Assert: Category is created and appears in budgets list
    await expect(page.getByTestId('new-category-dialog')).not.toBeVisible({timeout: 10000});
    const transportRow = page.getByTestId('budget-row-Transport');
    await expect(transportRow).toBeVisible();

    // Act: Edit the "Transport" budget
    // Note: We need to get the budget ID dynamically, so we'll click the first edit button in the Transport row
    await transportRow.locator('button[data-testid^="edit-budget-button-"]').click();
    await expect(page.getByTestId('edit-budget-dialog')).toBeVisible();

    // Act: Set plannedAmount to 15000
    await page.getByTestId('planned-amount-input').fill('15000');

    const editResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/category-budgets/') && response.request().method() === 'PATCH',
    );
    await page.getByTestId('edit-budget-submit').click();
    await editResponsePromise;

    // Assert: Budget is updated; toast confirms success
    await expect(page.getByText('Budžet kategorije je uspešno ažuriran')).toBeVisible();
    await expect(page.getByTestId('edit-budget-dialog')).not.toBeVisible({timeout: 10000});
  });
});
