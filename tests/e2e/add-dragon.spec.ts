import { expect, test } from '@playwright/test';

const DRAGON_CODE = 'abcde';

// A 1x1 transparent PNG, so dragon images never hit the real DragCave site.
const ONE_PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
);

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
  const dragonFixture = {
    id: DRAGON_CODE,
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
  };
  const apiUrl = process.env.DRAGCAVE_API_URL ?? 'http://127.0.0.1:3100/api/v2';
  const fixtureResponse = await request.put(
    new URL('/fixtures/dragon', apiUrl).toString(),
    { data: dragonFixture },
  );
  expect(fixtureResponse.status()).toBe(201);

  await page.addInitScript(() => {
    window.localStorage.setItem('garden-banner', 'false');
  });

  await page.route('https://dragcave.net/image/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'image/png',
      body: ONE_PIXEL_PNG,
    }),
  );

  await page.goto('/');

  await page.getByLabel('Code').fill(DRAGON_CODE);

  const checkResponse = page.waitForResponse(
    (response) =>
      response.request().method() === 'GET' &&
      new URL(response.url()).pathname === `/api/check/${DRAGON_CODE}`,
  );

  await page.getByRole('button', { name: 'Add dragon' }).click();

  const response = await checkResponse;
  expect(response.status()).toBe(200);

  const body = (await response.json()) as CheckResponse;
  expect(body.errors).toEqual([]);
  expect(body.data.acceptable).toBe(true);

  await expect(
    page.getByText(`(${DRAGON_CODE})`, { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('img', { name: DRAGON_CODE })).toBeVisible();
});
