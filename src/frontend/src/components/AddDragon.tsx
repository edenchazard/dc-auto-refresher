import { useState } from 'react';
import TimePicker from 'react-time-picker';
import type { TimePickerValue } from 'react-time-picker';
import { useSessionStorage } from 'usehooks-ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

import type { Dragon } from '../app/interfaces';
import DragonInstancesInput from './DragonInstancesInput';

interface AddDragonProps {
  addToList: (dragon: Dragon) => void;
  rate: number;
}
export default function AddDragon({ addToList, rate }: AddDragonProps) {
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
      <div className="bg-slate-800 p-5 max:rounded-lg ">
        <div className="my-2">
          <div className="flex justify-between items-center">
            <label htmlFor="code">Code:</label>
            <input
              id="code"
              className="text-black"
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
        <div className="my-2">
          <div className="flex justify-between items-center">
            <label htmlFor="instances">Instances:</label>
            <DragonInstancesInput
              instances={instances}
              setInstances={setInstances}
            />
          </div>
          <div className="text-gray-400">
            <p>
              {(rate === 0
                ? 'Variable: Each image will reload as soon as it has loaded.'
                : `~${
                    (60000 / rate) * instances
                  } views per minute: Actual rate depends on different factors.`) +
                " Specify '0' to add the dragon but not auto-refresh it."}
            </p>
            <aside
              className="italic"
              aria-label="information about views and unique views ratio"
              title="A dragon with 10 UVs will be limited to 150 Vs."
            >
              <p>
                <FontAwesomeIcon icon={faCircleInfo} />
                &nbsp;Dragon Cave limits views to 15x its unique views.
              </p>
            </aside>
          </div>
        </div>
        <div className="my-2">
          <div className="flex justify-between items-center">
            <label htmlFor="tod">Dies at:</label>
            <TimePicker
              onChange={setTOD}
              value={tod}
              format="mm:ss"
              maxDetail="second"
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
      </div>
      <div className="flex items-end flex-col mt-2 mx-5 max:mx-0">
        <button
          className="rounded bg-indigo-500 px-2 py-1 hover:bg-indigo-700"
          type="submit"
        >
          Add
        </button>
      </div>
    </form>
  );
}
