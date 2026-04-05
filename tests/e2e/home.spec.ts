import { expect, test } from '@playwright/test';

test('home page metadata and primary content render', async ({ page }) => {
  console.log('Navigating to home page');
  await page.goto('/');

  await expect(page).toHaveTitle(
    'FART - Fast Auto-Refresher Tool for dragcave.net',
  );
  await expect(
    page.getByRole('heading', { level: 1, name: 'FART' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { level: 2, name: 'Add a dragon' }),
  ).toBeVisible();
  await expect(page.getByText('No dragons have been added.')).toBeVisible();
});
