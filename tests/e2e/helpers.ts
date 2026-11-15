import type { APIRequestContext } from '@playwright/test';

export async function addDragonFixture(
  request: APIRequestContext,
  id: string,
  overrides: Record<string, unknown> = {},
) {
  await request.put(
    new URL('/fixtures/dragon', process.env.DRAGCAVE_API_URL).toString(),
    {
      data: {
        id,
        name: `Test Dragon ${id}`,
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
        ...overrides,
      },
    },
  );
}
