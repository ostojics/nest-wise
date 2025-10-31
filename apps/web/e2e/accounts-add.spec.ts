import {test, expect, Page} from '@playwright/test';

const TEST_LICENSE_KEY = '00000000-0000-0000-0000-000000000000';

test.describe('Add Accounts', () => {
  // Setup helper to complete onboarding and get to authenticated state
  async function completeSetup(page: Page) {
    await page.goto(`/setup?license=${TEST_LICENSE_KEY}`);
    await page.waitForLoadState('networkidle');

    // Complete step 1 - User form
    await page.getByTestId('setup-username-input').fill('testuser');
    await page.getByTestId('setup-email-input').fill('test@example.com');
    await page.getByTestId('setup-password-input').fill('Password123!');
    await page.getByTestId('setup-confirm-password-input').fill('Password123!');
    await page.getByTestId('setup-step1-submit').click();

    // Wait for step 2 to be visible
    await expect(page.getByTestId('setup-household-name-input')).toBeVisible();

    // Complete step 2 - Household form
    await page.getByTestId('setup-household-name-input').fill('Test Household');
    await page.getByTestId('setup-currency-select').click();
    // Select RSD currency
    await page.getByTestId('setup-currency-option-RSD').click();
    await page.getByTestId('setup-step2-submit').click();

    // Wait for onboarding page to load
    await page.waitForURL('/onboarding', {timeout: 10000});
  }

  test('user adds single account (happy path)', async ({page}) => {
    // Arrange: Complete setup to get authenticated session
    await completeSetup(page);

    // Navigate to Accounts page via sidebar
    await page.goto('/accounts');
    await page.waitForLoadState('networkidle');

    // Assert: Page is loaded with account creation button
    await expect(page.getByTestId('create-account-button')).toBeVisible();

    // Act: Click "Dodaj račun" button
    await page.getByTestId('create-account-button').click();

    // Assert: Dialog is opened
    await expect(page.getByTestId('create-account-dialog')).toBeVisible();

    // Fill in account details
    await page.getByTestId('account-name-input').fill('Tekući račun');

    // Select account type - "Tekući račun" (checking)
    await page.getByTestId('account-type-select').click();
    await page.getByTestId('account-type-option-checking').click();

    // Fill in initial balance
    await page.getByTestId('account-initial-balance-input').fill('12000');

    // Act: Submit the form
    await page.getByTestId('create-account-submit').click();

    // Assert: Dialog is closed and account card is visible
    await expect(page.getByTestId('create-account-dialog')).not.toBeVisible({timeout: 5000});

    // Assert: Account card is visible with correct name
    const accountCard = page.getByTestId('account-card-Tekući račun');
    await expect(accountCard).toBeVisible();

    // Assert: Account name is displayed
    await expect(accountCard.getByTestId('account-name')).toHaveText('Tekući račun');

    // Assert: Account balance is displayed (checking for formatted balance)
    // The balance should be formatted with currency symbol (e.g., "RSD 12,000.00" or "$12,000.00")
    const balanceElement = accountCard.getByTestId('account-balance');
    await expect(balanceElement).toBeVisible();
    // Use regex to match various currency formats
    await expect(balanceElement).toContainText(/12[,.]000/);
  });

  test('user adds multiple accounts', async ({page}) => {
    // Arrange: Complete setup to get authenticated session
    await completeSetup(page);

    // Navigate to Accounts page
    await page.goto('/accounts');
    await page.waitForLoadState('networkidle');

    // Add first account - "Tekući račun"
    await page.getByTestId('create-account-button').click();
    await expect(page.getByTestId('create-account-dialog')).toBeVisible();
    await page.getByTestId('account-name-input').fill('Tekući račun');
    await page.getByTestId('account-type-select').click();
    await page.getByTestId('account-type-option-checking').click();
    await page.getByTestId('account-initial-balance-input').fill('12000');
    await page.getByTestId('create-account-submit').click();
    await expect(page.getByTestId('create-account-dialog')).not.toBeVisible({timeout: 5000});

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
    await expect(page.getByTestId('create-account-dialog')).not.toBeVisible({timeout: 5000});

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
