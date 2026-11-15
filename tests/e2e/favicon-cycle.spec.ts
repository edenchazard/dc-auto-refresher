import { expect, test } from '@playwright/test';
import { addDragonFixture } from './helpers';

test('cycles the favicon between four dragons while auto-refreshing', async ({
  page,
  request,
}) => {
  const dragonIds = ['fav01', 'fav02', 'fav03', 'fav04'];

  for (const code of dragonIds) {
    await addDragonFixture(request, code);
  }

  await page.route('https://dragcave.net/image/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'image/png',
      body: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR4nGNgAAIAAAUAAXpeqz8AAAAASUVORK5CYII=',
        'base64',
      ),
    }),
  );

  await page.addInitScript(() => {
    window.localStorage.setItem('garden-banner', 'false');
  });

  await page.goto('/');

  for (const code of dragonIds) {
    await page.getByLabel('Code').fill(code);
    await page.getByRole('button', { name: 'Add dragon' }).click();
    await expect(page.getByText(`(${code})`, { exact: true })).toBeVisible();
  }

  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.getByRole('button', { name: 'Stop' })).toBeVisible();

  // The favicon href changes to a new dragon image every second. Sample it
  // until each of the four dragons has appeared.
  const seen = new Set<string>();
  await expect
    .poll(
      async () => {
        const href = await page
          .locator('link[rel="icon"]')
          .getAttribute('href');
        const match = /\/image\/([a-z0-9]+)/i.exec(href ?? '');
        if (match !== null) {
          seen.add(match[1]);
        }
        return seen.size;
      },
      { timeout: 10_000, intervals: [100] },
    )
    .toBe(dragonIds.length);

  expect([...seen].sort()).toEqual([...dragonIds].sort());
});
