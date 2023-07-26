import type { APIDragon } from './DragCaveAPIWrapper';

function validateCode(code: string): boolean {
  return /^[a-zA-Z0-9]{5}$/.test(code);
}

interface DragonInferredDetails {
  isAdult: boolean;
  isDead: boolean;
  isHidden: boolean;
  isFrozen: boolean;
  justHatched: boolean;
  tod: number | null;
}

type Dragon = APIDragon & DragonInferredDetails;

// Determines various characteristics about a dragon
function inferDragon(dragon: APIDragon, seconds: number | null): Dragon {
  // We need to compare the current seconds passed this hour with that of
  // what the user inputted, then we set the tod to the current date +
  // the hours, mins and seconds of the dragon remaining
  const calculateTOD = (hoursLeft: number, seconds: number): number | null => {
    if (hoursLeft === -1) return null;

    const now = new Date();
    const a = now.getUTCMinutes() * 60 + now.getUTCSeconds();

    // is hoursleft rounded? let's find out
    const hours = now.getUTCHours() + hoursLeft;
    const roundedHours = a >= seconds ? hours : hours - 1;

    // create the date in the future
    const tod = new Date();
    tod.setUTCHours(roundedHours, Math.floor(seconds / 60), seconds % 60);

    // console.log('user specified date ' + tod);

    return tod.getTime();
  };

  const isAdult = dragon.grow !== '0';
  const isDead = dragon.death !== '0';
  const isHidden =
    dragon.start === '0' && dragon.hatch === '0' && dragon.death === '0';
  const isFrozen = !isAdult && !isDead && !isHidden && dragon.hoursleft === -1;
  const justHatched = dragon.hoursleft === 168 && dragon.hatch !== '0';

  const tod = seconds !== null ? calculateTOD(dragon.hoursleft, seconds) : null;

  const inferred: DragonInferredDetails = {
    isAdult,
    isDead,
    isHidden,
    isFrozen,
    justHatched,
    tod,
  };

  return {
    ...inferred,
    ...dragon,
  };
}

export { validateCode, inferDragon };
