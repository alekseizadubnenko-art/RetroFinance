import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page).toHaveTitle(/RetroFinance/);
  // Click the "Демо режим" button on the welcome screen
  await page.click('text=Демо режим');

  // Check that the main dashboard is rendered
  await expect(page.locator('h2').first()).toHaveText('Финансовая сводка');

  // Navigate to settings and check if it renders
  await page.click('text=Настройки');
  await expect(page.locator('h2').first()).toHaveText('Настройки');
});