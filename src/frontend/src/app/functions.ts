import { Dragon, Size } from './interfaces';

export function isCodeInList(listOfDragons: Dragon[], code: string): boolean {
  return !!listOfDragons.find((dragon) => dragon.code === code);
}

export function validateCode(code: string): boolean {
  return /^[a-zA-Z0-9]{5}$/.test(code);
}

// Generates a dragcave img url with a cachebust
export function generateDragCaveImgUrl(
  code: string,
  noView: boolean = false,
): string {
  const cacheBust = Date.now() + Math.random();
  // no view disables views on the dragon
  return `https://dragcave.net/image/${code}${
    noView ? '/1' : ''
  }.gif?q=${cacheBust}`;
}

export function sizesSame(oldSize: Size, newSize: Size): boolean {
  return oldSize.w === newSize.w && oldSize.h === newSize.h;
}

export function getListFromQS(
  url: string = window.location.search,
): Dragon[] | null {
  const query = new URLSearchParams(url);
  const unserialize: Dragon[] = [];

  if (query.has('list')) {
    const dragons = query.get('list').split(';');
    for (const dragon of dragons) {
      const data = dragon.split(','),
        code = data[0],
        // defaults to 0 if not valid or floors if float
        instances = ~~data[1],
        // check if tod has passed and null it if so
        // or a 'bad' value
        tod =
          Date.now() > parseInt(data[2]) || isNaN(data[2] as any)
            ? null
            : parseInt(data[2]);

      // skip if not valid code
      if (validateCode(code) && !isCodeInList(unserialize, code))
        unserialize.push({ code, instances, tod });
    }
  }

  return unserialize.length > 0 ? unserialize : null;
}

export function createShareLinkFromList(list: Dragon[]) {
  const map = ({ code, instances, tod }) =>
    `${code},${instances},${isNaN(tod) ? 'null' : tod}`;

  const { origin, pathname } = window.location;

  return `${origin}${pathname}?list=` + list.map(map).join(';');
}
