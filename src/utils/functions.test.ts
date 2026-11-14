import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Dragon, Size } from '../app/types';
import {
  createShareLinkFromList,
  generateDragCaveImgUrl,
  getListFromString,
  hasRefreshableDragons,
  isCodeInList,
  sizesSame,
  validateCode,
} from './functions';

function dragon(overrides: Partial<Dragon> = {}): Dragon {
  return {
    code: 'abcde',
    instances: 1,
    tod: null,
    enabled: true,
    ...overrides,
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('isCodeInList', () => {
  it('finds a dragon by code', () => {
    const list = [dragon({ code: 'abcde' }), dragon({ code: 'fghij' })];

    expect(isCodeInList(list, 'fghij')).toBe(true);
  });

  it('returns false when the code is not present', () => {
    expect(isCodeInList([dragon({ code: 'abcde' })], 'zzzzz')).toBe(false);
  });
});

describe('validateCode', () => {
  it('accepts exactly five alphanumeric characters', () => {
    expect(validateCode('abcde')).toBe(true);
    expect(validateCode('A1b2C')).toBe(true);
  });

  it.each(['', 'abcd', 'abcdef', 'abc-e', 'abc e'])('rejects %j', (code) => {
    expect(validateCode(code)).toBe(false);
  });
});

describe('generateDragCaveImgUrl', () => {
  it('builds an image url with a cachebust query', () => {
    expect(generateDragCaveImgUrl('abcde')).toMatch(
      /^https:\/\/dragcave\.net\/image\/abcde\?q=\d+\.\d+$/,
    );
  });

  it('disables views with the /1 suffix', () => {
    expect(generateDragCaveImgUrl('abcde', true)).toMatch(
      /^https:\/\/dragcave\.net\/image\/abcde\/1\?q=/,
    );
  });
});

describe('sizesSame', () => {
  it('compares width and height', () => {
    const a: Size = { w: 10, h: 20 };

    expect(sizesSame(a, { w: 10, h: 20 })).toBe(true);
    expect(sizesSame(a, { w: 10, h: 21 })).toBe(false);
  });
});

describe('getListFromString', () => {
  it('parses a serialised list', () => {
    const tod = Date.now() + 60_000;

    expect(getListFromString(`abcde,3,true,${tod}`)).toEqual([
      { code: 'abcde', instances: 3, tod, enabled: true },
    ]);
  });

  it('drops invalid and duplicate codes', () => {
    expect(
      getListFromString('abcde,1,true;abcde,2,true;zzzz,1,true;qwert,0,false'),
    ).toEqual([
      { code: 'abcde', instances: 1, tod: null, enabled: true },
      { code: 'qwert', instances: 0, tod: null, enabled: false },
    ]);
  });

  it('discards a tod that is in the past', () => {
    const past = Date.now() - 60_000;

    const [parsed] = getListFromString(`abcde,1,true,${past}`) ?? [];

    expect(parsed?.tod).toBeNull();
  });
});

describe('createShareLinkFromList', () => {
  it('serialises the list onto the current path', () => {
    vi.stubGlobal('window', {
      location: { origin: 'https://example.com', pathname: '/app' },
    });

    expect(
      createShareLinkFromList([
        dragon({ code: 'abcde', instances: 2, tod: 123, enabled: true }),
        dragon({ code: 'fghij', instances: 0, tod: null, enabled: false }),
      ]),
    ).toBe('https://example.com/app?list=abcde,2,true,123;fghij,0,false');
  });
});

describe('hasRefreshableDragons', () => {
  it('is true when any dragon has instances', () => {
    expect(hasRefreshableDragons([dragon({ instances: 0 }), dragon()])).toBe(
      true,
    );
  });

  it('is false when no dragon has instances', () => {
    expect(hasRefreshableDragons([dragon({ instances: 0 })])).toBe(false);
  });
});
