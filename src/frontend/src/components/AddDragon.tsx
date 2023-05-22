import { ReactChildren, ReactElement, useState } from 'react';
import TimePicker from 'react-time-picker';
import type { TimePickerValue } from 'react-time-picker';
import { useSessionStorage } from 'usehooks-ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

import type { Dragon } from '../app/interfaces';
import DragonInstancesInput from './DragonInstancesInput';
import Label from './Label';
import { Button } from './Buttons';

interface AddDragonProps {
  addToList: (dragon: Dragon) => void;
  rate: number;
  top?: ReactElement;
  bottom?: ReactElement;
}
export default function AddDragon({
  addToList,
  rate,
  top,
  bottom,
}: AddDragonProps) {
  const [code, setCode] = useState<string>('');
  const [instances, setInstances] = useSessionStorage('addInstances', 1);
  const [tod, setTOD] = useState<TimePickerValue>('');

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // by default don't specify a tod, only send the clock value
    // if it's been modified
    let secondsInTOD: null | number = null;

    // The types are not entirely accurate
    // as the timepicker value can be null if the input isn't
    // filled out completely.
    if (typeof tod === 'string' && tod !== '') {
      const [, mins, seconds] = tod.split(':');
      secondsInTOD = parseInt(mins) * 60 + parseInt(seconds);
    }

    addToList({
      code,
      instances,
      tod: secondsInTOD,
    });

    // reset things
    setCode('');
    setTOD('');
  }

  return (
    <form onSubmit={handleAdd}>
      <div className="bg-slate-800 p-2 minsz:rounded-lg minsz:px-5">
        {top && top}
        <div className="flex flex-col gap-3 items-stretch ">
          <div>
            <div className="flex justify-between items-center">
              <Label
                id="code"
                text="Code"
              />
              <input
                id="code"
                required
                className="w-15"
                type="text"
                placeholder="Code"
                value={code}
                size={5}
                minLength={4}
                maxLength={5}
                onChange={(e) => {
                  setCode(e.target.value);
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center">
              <Label
                id="instances"
                text="Instances"
              />
              <DragonInstancesInput
                className="w-20"
                instances={instances}
                setInstances={setInstances}
                required
                id="instances"
                aria-describedby="instances-description ratio-limit"
              />
            </div>
            <div className="text-gray-400">
              <p id="instances-description">
                {(rate === 0
                  ? 'Variable: Each image will reload as soon as it has loaded.'
                  : `~${
                      (60000 / rate) * instances
                    } views per minute: Actual rate depends on different factors.`) +
                  " Specify '0' to add the dragon but not auto-refresh it."}
              </p>
              <aside className="italic">
                <p>
                  <FontAwesomeIcon icon={faCircleInfo} />
                  &nbsp;
                  <span id="ratio-limit">
                    Dragon Cave limits views to 15x its unique views.
                  </span>
                </p>
              </aside>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center">
              <Label
                id="tod"
                text="Dies at"
              />
              <TimePicker
                onChange={setTOD}
                value={tod}
                format="mm:ss"
                maxDetail="second"
                disableClock={true}
                clearAriaLabel="Clear TOD"
                name="test"
              />
            </div>
            <div className="text-gray-400">
              <p>
                (Optional) Specify the minute and second the timer changes and
                FART will provide a TOD countdown. Dragon must be unfogged.
              </p>
            </div>
          </div>
          <Button
            type="submit"
            className="button-purple"
          >
            Add dragon
          </Button>
        </div>
        {bottom && bottom}
      </div>
    </form>
  );
}
