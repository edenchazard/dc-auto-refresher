import { expect, test } from '@playwright/test';
import { addDragonFixture } from './helpers';

test('smart removal removes a dragon when its image size changes', async ({
  page,
  request,
}) => {
  const id = 'smart';

  await addDragonFixture(request, id, { hatch: '1', hoursleft: 168 });

  let useGrownImage = false;
  await page.route('https://dragcave.net/image/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'image/png',
      body: useGrownImage
        ? Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAHElEQVR4nO3BAQEAAACCIP+vbkhAAQAAAAAAfBoZKAABYJ0ZdgAAAABJRU5ErkJggg==',
            'base64',
          )
        : Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR4nGNgAAIAAAUAAXpeqz8AAAAASUVORK5CYII=',
            'base64',
          ),
    }),
  );

  await page.addInitScript(() => {
    window.localStorage.setItem('garden-banner', 'false');
    window.sessionStorage.setItem('smartRemoval', 'true');
  });

  await page.goto('/');

  await page.getByLabel('Code').fill(id);
  await page.getByRole('button', { name: 'Add dragon' }).click();
  await expect(page.getByText(`(${id})`, { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Start' }).click();

  // Wait for the first refresh to load the original image size before
  // pretending the dragon has grown.
  const refresherImage = page.locator(`img[data-code="${id}"]`);
  await expect
    .poll(() =>
      refresherImage.evaluate((img: HTMLImageElement) => img.naturalWidth),
    )
    .toBe(1);

  useGrownImage = true;

  await expect(page.getByText(`(${id})`, { exact: true })).toBeHidden({
    timeout: 10_000,
  });
  await expect(page.getByText('No dragons have been added.')).toBeVisible();
});
