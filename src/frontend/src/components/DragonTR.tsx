import DragonInstancesInput from './DragonInstancesInput';
import { generateDragCaveImgUrl } from '../app/functions';
import { CountDown } from './Clock';
import type { Dragon } from '../app/interfaces';

interface RateCalculatorProps {
  rate: number;
  instances: number;
}
const RateCalculator = ({ rate, instances }: RateCalculatorProps) => {
  if (rate > 0 && instances > 0) {
    const calc = (60000 / rate) * instances;

    // set to 0 if for some reason it isn't a number
    const calculatedRate = Number.isNaN(calc) ? 0 : calc;

    return (
      <span>
        ~{calculatedRate} <abbr title="views per minute">V/M</abbr>
      </span>
    );
  } else if (instances === 0) {
    return <span>None</span>;
  } else {
    return <span>Variable</span>;
  }
};

interface DragonTRProps {
  dragon: Dragon;
  setInstances: (value: number) => void;
  rate: number;
  remove: () => void;
}
export default function DragonTR({
  setInstances,
  rate,
  remove,
  dragon,
}: DragonTRProps) {
  // keep null or transform our tod into a future date
  const diesOn = dragon.tod === null ? null : new Date(dragon.tod);

  return (
    <div className="flex flex-col items-center">
      <i>({dragon.code})</i>
      <DragonInstancesInput
        instances={dragon.instances}
        setInstances={setInstances}
      />
      <RateCalculator
        rate={rate}
        instances={dragon.instances}
      />
      {diesOn !== null ? (
        <span
          data-tip={'TOD: ' + diesOn.toLocaleString()}
          data-event="click"
        >
          <CountDown to={diesOn} />
        </span>
      ) : (
        '-----'
      )}
      <button
        className="bg-red-400 rounded px-2 py-1 my-1 hover:bg-red-600"
        onClick={remove}
      >
        Delete
      </button>
      <a
        href={`https://dragcave.net/view/${dragon.code}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          alt="dragon"
          src={generateDragCaveImgUrl(dragon.code, true)}
        />
      </a>
    </div>
  );
}
