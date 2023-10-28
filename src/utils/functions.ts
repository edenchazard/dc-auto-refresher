import { type Dragon, type Size } from '../app/types';

export function isCodeInList(listOfDragons: Dragon[], code: string): boolean {
  return listOfDragons.find((dragon) => dragon.code === code) !== undefined;
}

export function validateCode(code: string): boolean {
  return /^[a-zA-Z0-9]{5}$/.test(code);
}

// Generates a dragcave img url with a cachebust
export function generateDragCaveImgUrl(code: string, noView = false): string {
  const cacheBust = Date.now() + Math.random();
  // no view disables views on the dragon
  return `https://dragcave.net/image/${code}${
    noView ? '/1' : ''
  }?q=${cacheBust}`;
}

export function sizesSame(oldSize: Size, newSize: Size): boolean {
  return oldSize.w === newSize.w && oldSize.h === newSize.h;
}

export function getListFromString(str: string): Dragon[] | null {
  const unserialize: Dragon[] = [];
  const list = str.split(';');

  const dragonStringToDragon = (str: string): Dragon => {
    const [code, instances, tod] = str.split(',');

    return {
      code: code,
      instances: ~~instances,
      tod: Date.now() < ~~tod ? ~~tod : null,
    };
  };

  for (const item of list) {
    const dragon = dragonStringToDragon(item);

    // skip if not valid code
    if (validateCode(dragon.code) && !isCodeInList(unserialize, dragon.code))
      unserialize.push(dragon);
  }

  return unserialize.length > 0 ? unserialize : null;
}

export function createShareLinkFromList(list: Dragon[]): string {
  const { origin, pathname } = window.location;

  // TODO: We'll keep null in the string to ensure backwards compatibility
  // but may change this later.
  const values = list
    .map(
      ({ code, instances, tod }) =>
        `${code},${instances}` + (tod === null ? '' : `,${tod}`),
    )
    .join(';');

  return `${origin}${pathname}?list=${values}`;
}

export function hasRefreshableDragons(listOfDragons: Dragon[]): boolean {
  return listOfDragons.findIndex((dragon) => dragon.instances > 0) > -1;
}
