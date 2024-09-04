import { test, expect } from '@playwright/test';



test('test', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByLabel('Search').click();
  await expect(page.getByPlaceholder('Search docs')).toBeEmpty();
  await expect(page.getByPlaceholder('Search docs')).toBeEmpty();
  await page.getByPlaceholder('Search docs').click();
  await page.getByPlaceholder('Search docs').fill('vvv');
  await expect(page.getByPlaceholder('Search docs')).toHaveValue('vvv');
  await page.getByPlaceholder('Search docs').click();
  await page.getByPlaceholder('Search docs').click({
    button: 'right'
  });
});

