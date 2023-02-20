import { useState } from 'react';
import TimePicker from 'react-time-picker';

import type { Dragon } from '../app/interfaces';
import DragonInstancesInput from './DragonInstancesInput';

interface AddDragonProps {
  addToList: (dragon: Dragon) => void;
  rate: number;
}
export default function AddDragon({ addToList, rate }: AddDragonProps) {
  const [code, setCode] = useState<string>('');
  const [instances, setInstances] = useState<number>(1);
  const [tod, setTOD] = useState<string | null>(null);

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // by default don't specify a tod, only send the clock value
    // if it's been modified
    let secondsInTOD: null | number = null;

    if (typeof tod === 'string') {
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
    setTOD(null);
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
          </div>
        </div>
        <div className="my-2">
          <div className="flex justify-between items-center">
            <label htmlFor="tod">Dies at:</label>
            <TimePicker
              id="tod"
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
