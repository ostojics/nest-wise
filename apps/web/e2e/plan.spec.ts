import {test, expect} from '@playwright/test';

test.describe('Plan Page', () => {
  test('user sees plan page instructions', async ({page}) => {
    // Arrange: Navigate to plan page
    await page.goto('/plan');
    await page.waitForLoadState('networkidle');

    // Assert: Verify page title is displayed
    await expect(page.getByTestId('plan-page-title')).toBeVisible();
    await expect(page.getByTestId('plan-page-title')).toContainText('Planirajte troškove domaćinstva po kategorijama');

    // Assert: Verify page description is displayed
    await expect(page.getByTestId('plan-page-description')).toBeVisible();
    await expect(page.getByTestId('plan-page-description')).toContainText(
      'Postavite planirani iznos za svaku kategoriju. Kako unosite transakcije, vaša potrošnja se automatski prati za izabrani mesec.',
    );
  });
});
