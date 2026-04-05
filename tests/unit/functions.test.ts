import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createShareLinkFromList,
  generateDragCaveImgUrl,
  getListFromString,
  hasRefreshableDragons,
  isCodeInList,
  sizesSame,
  validateCode,
} from '../../src/utils/functions';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('validateCode', () => {
  it('accepts five character alphanumeric codes', () => {
    expect(validateCode('Ab123')).toBe(true);
  });

  it('rejects invalid codes', () => {
    expect(validateCode('abcd')).toBe(false);
    expect(validateCode('abc-1')).toBe(false);
  });
});

describe('isCodeInList', () => {
  it('finds an existing dragon code', () => {
    expect(
      isCodeInList(
        [{ code: 'abc12', instances: 1, tod: null, enabled: true }],
        'abc12',
      ),
    ).toBe(true);
  });
});

describe('generateDragCaveImgUrl', () => {
  it('adds the no-view path when requested', () => {
    vi.spyOn(Date, 'now').mockReturnValue(123);
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    expect(generateDragCaveImgUrl('abc12', true)).toBe(
      'https://dragcave.net/image/abc12/1?q=123.5',
    );
  });
});

describe('sizesSame', () => {
  it('compares width and height', () => {
    expect(sizesSame({ w: 10, h: 20 }, { w: 10, h: 20 })).toBe(true);
    expect(sizesSame({ w: 10, h: 20 }, { w: 20, h: 10 })).toBe(false);
  });
});

describe('getListFromString', () => {
  it('parses valid dragons and removes duplicates', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000);

    expect(
      getListFromString(
        'abc12,2,true,2000;abc12,1,false,3000;nope,1,true,2000',
      ),
    ).toEqual([{ code: 'abc12', instances: 2, tod: 2000, enabled: true }]);
  });

  it('drops expired tod values', () => {
    vi.spyOn(Date, 'now').mockReturnValue(2_000);

    expect(getListFromString('abc12,2,true,1000')).toEqual([
      { code: 'abc12', instances: 2, tod: null, enabled: true },
    ]);
  });
});

describe('createShareLinkFromList', () => {
  it('serializes the current list into the query string', () => {
    vi.stubGlobal('window', {
      location: {
        origin: 'https://example.com',
        pathname: '/dc/auto-refresher',
      },
    });

    expect(
      createShareLinkFromList([
        { code: 'abc12', instances: 2, tod: 9999, enabled: true },
        { code: 'xyz34', instances: 1, tod: null, enabled: false },
      ]),
    ).toBe(
      'https://example.com/dc/auto-refresher?list=abc12,2,true,9999;xyz34,1,false',
    );
  });
});

describe('hasRefreshableDragons', () => {
  it('requires at least one dragon with instances', () => {
    expect(
      hasRefreshableDragons([
        { code: 'abc12', instances: 0, tod: null, enabled: true },
      ]),
    ).toBe(false);
    expect(
      hasRefreshableDragons([
        { code: 'abc12', instances: 1, tod: null, enabled: true },
      ]),
    ).toBe(true);
  });
});
