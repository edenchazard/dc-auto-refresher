import { type ReactElement, useState } from 'react';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import { useSessionStorage } from 'usehooks-ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

import type { Dragon } from '../app/types';
import DragonInstancesInput from './DragonInstancesInput';
import Label from './Label';
import { Button } from './Buttons';
import type { TimePickerProps } from 'react-time-picker';

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
  const [tod, setTOD] = useState<TimePickerProps['value']>(null);

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
      enabled: true,
    });

    // reset things
    setCode('');
    setTOD(null);
  }

  function handlePaste(e: ClipboardEvent) {
    e.preventDefault();

    if (!e.clipboardData) {
      return;
    }

    setCode(
      e.clipboardData
        .getData('text/plain')
        .replace(/[^0-9a-z]/gi, '')
        .slice(0, 5),
    );
  }

  return (
    <form
      onSubmit={handleAdd}
      autoComplete="off"
    >
      <div className="bg-slate-800 p-2 minsz:rounded-lg minsz:px-5">
        {top !== null && top}
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
                onPaste={handlePaste}
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
            <div className="text-gray-400 flex flex-wrap gap-2">
              <p id="instances-description ">
                {(rate === 0
                  ? 'Variable: Each image will reload as soon as it has loaded.'
                  : `~${
                      (60000 / rate) * instances
                    } views per minute: Actual rate depends on different factors.`) +
                  " Specify '0' to add the dragon but not auto-refresh it."}
              </p>
              <p className="bg-slate-600 rounded-2xl text-gray-200 text-xs py-1 px-3 italic">
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  className="mr-2"
                />
                <span id="ratio-limit">
                  Dragon Cave limits views to 15x its unique views.
                </span>
              </p>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center">
              <Label
                id="tod"
                text="Dies at"
              />
              <TimePicker
                onChange={(e) => setTOD(e)}
                id="tod"
                value={tod}
                format="mm:ss"
                maxDetail="second"
                clearAriaLabel="Clear TOD"
                name="tod"
                disableClock={true}
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
        {bottom !== null && bottom}
      </div>
    </form>
  );
}
