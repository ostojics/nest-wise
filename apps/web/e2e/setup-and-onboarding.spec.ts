import {test, expect} from '@playwright/test';

const TEST_LICENSE_KEY = '00000000-0000-0000-0000-000000000000';

test.describe('Setup and Onboarding', () => {
  test('user completes setup step 1 - user form', async ({page}) => {
    // Arrange: Navigate to setup page with license param
    await page.goto(`/setup?license=${TEST_LICENSE_KEY}`);
    await page.waitForLoadState('networkidle');

    // Act: Fill in user information
    await page.getByTestId('setup-username-input').fill('testuser');
    await page.getByTestId('setup-email-input').fill('test@example.com');
    await page.getByTestId('setup-password-input').fill('Password123!');
    await page.getByTestId('setup-confirm-password-input').fill('Password123!');
    await page.getByTestId('setup-step1-submit').click();

    // Assert: Step 2 form should be visible
    await expect(page.getByTestId('setup-household-name-input')).toBeVisible();
  });

  test('user completes setup step 2 - household form and redirect', async ({page}) => {
    // Arrange: Navigate to setup and complete step 1
    await page.goto(`/setup?license=${TEST_LICENSE_KEY}`);
    await page.waitForLoadState('networkidle');

    // Complete step 1
    await page.getByTestId('setup-username-input').fill('testuser');
    await page.getByTestId('setup-email-input').fill('test@example.com');
    await page.getByTestId('setup-password-input').fill('Password123!');
    await page.getByTestId('setup-confirm-password-input').fill('Password123!');
    await page.getByTestId('setup-step1-submit').click();

    // Wait for step 2 to be visible
    await expect(page.getByTestId('setup-household-name-input')).toBeVisible();

    // Act: Fill in household information
    await page.getByTestId('setup-household-name-input').fill('Test Household');
    await page.getByTestId('setup-currency-select').click();
    // Select RSD currency
    await page.getByRole('option', {name: 'RSD - Serbian Dinar'}).click();
    await page.getByTestId('setup-step2-submit').click();

    // Assert: Success toast should appear
    await expect(page.getByText('Podešavanje je uspešno završeno')).toBeVisible();

    // Assert: Should redirect to onboarding page
    await page.waitForURL('/onboarding');
    expect(page.url()).toContain('/onboarding');
  });

  test('user sees onboarding welcome step', async ({page}) => {
    // Arrange: Navigate to onboarding page
    await page.goto('/onboarding');
    await page.waitForLoadState('networkidle');

    // Assert: Welcome title and description are visible
    await expect(page.getByTestId('onboarding-step-title')).toBeVisible();
    await expect(page.getByTestId('onboarding-step-title')).toHaveText('Dobro došli u NestWise!');

    await expect(page.getByTestId('onboarding-step-description')).toBeVisible();
    await expect(page.getByTestId('onboarding-step-description')).toContainText(
      'Za 2 minuta: dodajte račun, napravite plan i zabeležite prvu transakciju',
    );

    // Assert: Primary and secondary action buttons are visible with correct labels
    await expect(page.getByTestId('onboarding-primary-action')).toBeVisible();
    await expect(page.getByTestId('onboarding-primary-action')).toHaveText('Dalje');

    await expect(page.getByTestId('onboarding-secondary-action')).toBeVisible();
    await expect(page.getByTestId('onboarding-secondary-action')).toHaveText('Preskočite');
  });

  test('user navigates through onboarding steps', async ({page}) => {
    // Arrange: Navigate to onboarding page
    await page.goto('/onboarding');
    await page.waitForLoadState('networkidle');

    // Act: Click "Dalje" to move to step 2
    await page.getByTestId('onboarding-primary-action').click();

    // Assert: Step 2 - Add Account
    await expect(page.getByTestId('onboarding-step-title')).toHaveText('Dodajte račun');
    await expect(page.getByTestId('onboarding-step-description')).toContainText('Račun je mesto gde držite novac');
    // Verify bullets are present
    await expect(page.getByTestId('onboarding-step-bullets')).toBeVisible();
    const step2Bullets = page.getByTestId('onboarding-step-bullets');
    await expect(step2Bullets).toContainText('Otvorite stranicu računi');
    await expect(step2Bullets).toContainText('Kliknite „Dodaj račun"');
    await expect(step2Bullets).toContainText('Unesite naziv, tip i početno stanje');

    // Act: Click "Dalje" to move to step 3
    await page.getByTestId('onboarding-primary-action').click();

    // Assert: Step 3 - Create Plan
    await expect(page.getByTestId('onboarding-step-title')).toHaveText('Napravite plan');
    await expect(page.getByTestId('onboarding-step-description')).toContainText('Kroz kategorije grupišete troškove');
    // Verify bullets are present
    await expect(page.getByTestId('onboarding-step-bullets')).toBeVisible();
    const step3Bullets = page.getByTestId('onboarding-step-bullets');
    await expect(step3Bullets).toContainText('Kategorije: Dodajte nekoliko kategorija');
    await expect(step3Bullets).toContainText('Budžet: Postavite mesečne limite po kategorijama');
  });

  test('user completes onboarding and navigates to plan', async ({page}) => {
    // Arrange: Navigate to onboarding page
    await page.goto('/onboarding');
    await page.waitForLoadState('networkidle');

    // Act: Navigate through all steps
    // Step 1 -> Step 2
    await page.getByTestId('onboarding-primary-action').click();

    // Step 2 -> Step 3
    await page.getByTestId('onboarding-primary-action').click();

    // Step 3 -> Step 4
    await page.getByTestId('onboarding-primary-action').click();

    // Assert: Step 4 - Record First Transaction
    await expect(page.getByTestId('onboarding-step-title')).toHaveText('Zabeležite prvu transakciju');
    await expect(page.getByTestId('onboarding-step-description')).toContainText(
      'Transakcije mogu biti rashod ili prihod',
    );

    // Assert: Primary action has correct label for final step
    await expect(page.getByTestId('onboarding-primary-action')).toHaveText('Završite i idite na plan');

    // Act: Click final action to go to plan
    await page.getByTestId('onboarding-primary-action').click();

    // Assert: Should navigate to plan page
    await page.waitForURL('/plan');
    expect(page.url()).toContain('/plan');
  });
});
