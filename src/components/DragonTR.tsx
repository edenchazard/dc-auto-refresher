import type React from 'react';
import { Tooltip } from 'react-tooltip';

import DragonInstancesInput from './DragonInstancesInput';
import { generateDragCaveImgUrl } from '../utils/functions';
import { CountDown } from './Clock';
import type { Dragon } from '../app/types';
import { Button } from './Buttons';

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

interface DragonTRProps extends React.HTMLProps<HTMLDivElement> {
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
  ...props
}: DragonTRProps) {
  // keep null or transform our tod into a future date
  const diesOn = dragon.tod === null ? null : new Date(dragon.tod);

  return (
    <div {...props}>
      <Tooltip id={dragon.code} />
      <a
        className="w-full text-center h-12"
        href={`https://dragcave.net/view/${dragon.code}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className="inline max-h-full"
          alt={dragon.code}
          src={generateDragCaveImgUrl(dragon.code, true)}
        />
      </a>
      <label
        htmlFor={`dragon-${dragon.code}`}
        className="italic"
      >
        ({dragon.code})
      </label>
      <DragonInstancesInput
        id={`dragon-${dragon.code}`}
        instances={dragon.instances}
        setInstances={setInstances}
      />
      <RateCalculator
        rate={rate}
        instances={dragon.instances}
      />
      <div className="h-7">
        {diesOn !== null && (
          <time
            className="block h-full"
            data-tooltip-id={dragon.code}
            data-tooltip-content={'TOD: ' + diesOn.toLocaleString()}
            data-event="click"
            role="timer"
          >
            <CountDown to={diesOn} />
          </time>
        )}
      </div>
      <Button
        title={`Remove ${dragon.code}`}
        onClick={remove}
        className="button-green"
      >
        Remove
      </Button>
    </div>
  );
}
