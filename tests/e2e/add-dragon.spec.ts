import { expect, test } from '@playwright/test';

interface CheckResponse {
  errors: string[];
  data: {
    acceptable: boolean;
    justHatched: boolean;
    tod: number | null;
  };
}

test('adds a dragon returned by the check endpoint to the list', async ({
  page,
  request,
}) => {
  const id = 'abcde';

  await request.put(
    new URL('/fixtures/dragon', process.env.DRAGCAVE_API_URL).toString(),
    {
      data: {
        id,
        name: 'Test Dragon',
        owner: 'tester',
        start: '2026-11-14T00:00:00Z',
        hatch: '0',
        grow: '0',
        death: '0',
        views: 1,
        unique: 1,
        clicks: 0,
        gender: '',
        hoursleft: 24,
        parent_f: '',
        parent_m: '',
      },
    },
  );

  await page.route('https://dragcave.net/image/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'image/png',
      body: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
        'base64',
      ),
    }),
  );

  await page.addInitScript(() => {
    window.localStorage.setItem('garden-banner', 'false');
  });

  await page.goto('/');

  await page.getByLabel('Code').fill(id);

  const checkResponse = page.waitForResponse(
    (response) =>
      response.request().method() === 'GET' &&
      new URL(response.url()).pathname === `/api/check/${id}`,
  );
  await page.getByRole('button', { name: 'Add dragon' }).click();

  const response = await checkResponse;

  expect(response.status()).toBe(200);

  const body = (await response.json()) as CheckResponse;
  expect(body.errors).toEqual([]);
  expect(body.data.acceptable).toBe(true);

  await expect(page.getByText(`(${id})`, { exact: true })).toBeVisible();

  await expect(page.getByRole('img', { name: id })).toBeVisible();
});
