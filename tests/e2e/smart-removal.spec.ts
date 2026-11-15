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

  // Force a completed load at the original size so the refresher has
  // definitely recorded it before the image changes.
  const refresherImage = page.locator(`img[data-code="${id}"]`);
  const originalWidth = await refresherImage.evaluate(
    async (img: HTMLImageElement) => {
      await new Promise<void>((resolve) => {
        img.addEventListener('load', () => resolve(), { once: true });
        img.src = `${img.src.split('?')[0]}?q=${Date.now()}`;
      });
      return img.naturalWidth;
    },
  );
  expect(originalWidth).toBe(1);

  useGrownImage = true;

  await expect(page.getByText(`(${id})`, { exact: true })).toBeHidden({
    timeout: 10_000,
  });
  await expect(page.getByText('No dragons have been added.')).toBeVisible();
});
