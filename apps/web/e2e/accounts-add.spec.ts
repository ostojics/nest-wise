import {test, expect} from '@playwright/test';

test.describe('Add Accounts', () => {
  test('user adds single account (happy path)', async ({page}) => {
    // Arrange: Navigate to Accounts page (MSW mocks authenticated state)
    await page.goto('/accounts');

    // Assert: Page is loaded with account creation button
    await expect(page.getByTestId('create-account-button')).toBeVisible();

    // Act: Click "Dodaj račun" button
    await page.getByTestId('create-account-button').click();

    // Assert: Dialog is opened
    await expect(page.getByTestId('create-account-dialog')).toBeVisible();

    // Fill in account details
    await page.getByTestId('account-name-input').fill('Tekući račun');

    // Fill in initial balance
    await page.getByTestId('account-initial-balance-input').fill('12000');

    // Scroll the submit button into view before clicking
    const submitButton = page.getByTestId('create-account-submit');
    await submitButton.scrollIntoViewIfNeeded();

    // Act: Submit the form and wait for network request
    await submitButton.click();

    // Assert: Account card is visible with correct name
    const accountCard = page.getByTestId('account-card-Tekući račun');
    await expect(accountCard).toBeVisible();

    // Assert: Account name is displayed
    await expect(accountCard.getByTestId('account-name')).toHaveText('Tekući račun');

    // Assert: Account balance is displayed (checking for formatted balance)
    const balanceElement = accountCard.getByTestId('account-balance');
    await expect(balanceElement).toBeVisible();
  });

  test('user adds multiple accounts', async ({page}) => {
    // Arrange: Navigate to Accounts page (MSW mocks authenticated state)
    await page.goto('/accounts');
    await page.waitForLoadState('networkidle');

    // Add first account - "Tekući račun"
    await page.getByTestId('create-account-button').click();
    await expect(page.getByTestId('create-account-dialog')).toBeVisible();
    await page.getByTestId('account-name-input').fill('Tekući račun');
    await page.getByTestId('account-type-select').click();
    await page.getByTestId('account-type-option-checking').click();
    await page.getByTestId('account-initial-balance-input').fill('12000');

    // Wait for network request to complete before checking dialog state
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/accounts') && response.request().method() === 'POST',
    );
    await page.getByTestId('create-account-submit').click();
    await responsePromise;

    // Wait for the dialog to close after successful submission
    await expect(page.getByTestId('create-account-dialog')).not.toBeVisible({timeout: 10000});

    // Assert: First account is visible
    await expect(page.getByTestId('account-card-Tekući račun')).toBeVisible();

    // Add second account - "Keš novčanik"
    await page.getByTestId('create-account-button').click();
    await expect(page.getByTestId('create-account-dialog')).toBeVisible();
    await page.getByTestId('account-name-input').fill('Keš novčanik');
    await page.getByTestId('account-type-select').click();
    await page.getByTestId('account-type-option-cash').click();
    await page.getByTestId('account-initial-balance-input').fill('2500');

    await page.getByTestId('create-account-submit').click();

    // Assert: Both accounts are visible
    await expect(page.getByTestId('account-card-Tekući račun')).toBeVisible();
    await expect(page.getByTestId('account-card-Keš novčanik')).toBeVisible();

    // Assert: Second account has correct name and balance
    const secondAccountCard = page.getByTestId('account-card-Keš novčanik');
    await expect(secondAccountCard.getByTestId('account-name')).toHaveText('Keš novčanik');
    const balanceElement = secondAccountCard.getByTestId('account-balance');
    await expect(balanceElement).toBeVisible();
    await expect(balanceElement).toContainText(/2[,.]500/);
  });
});
