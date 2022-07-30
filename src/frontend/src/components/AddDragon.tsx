import TimePicker from 'react-time-picker';

import { useState } from 'react';
import DragonInstancesInput from "./DragonInstancesInput";

export default function AddDragon({addToList, rate}){
    const   [code, setCode] = useState<string>(""),
            [instances, setInstances] = useState<number>(1),
            [tod, setTOD] = useState<string>(null);

    function handleAdd(){
        // by default don't specify a tod, only send the clock value
        // if it's been modified
        let s = null;
        if(tod){
            const [, mins, seconds ] = tod.split(":");
            s = (parseInt(mins) * 60) + (parseInt(seconds));
        }

        addToList(code, instances, s);

        // reset things
        setCode("");
        setTOD(null);
    }

    return (
            <div className='space-y-1 my-1'>
                <div className='flex justify-between items-center'>
                    <label htmlFor='code'>Code:</label>
                    <input
                        id="code"
                        className='text-black'
                        type='text'
                        placeholder="Code"
                        value={code}
                        size={5}
                        minLength={4}
                        maxLength={5}
                        onChange={(e) => setCode(e.target.value)}/>
                </div>
                <div className='flex justify-between items-center'>
                    <label htmlFor='instances'>Instances:</label>
                    <DragonInstancesInput
                        instances={instances}
                        setInstances={setInstances} />
                </div>
                <div className='flex justify-between text-gray-400'>
                    <p>
                        {
                        (rate === 0
                            ? "Variable: Each image will reload as soon as it has loaded."
                            : `~${(60000 / rate) * instances} views per minute: Actual rate depends on different factors.`
                         )+ " Specify '0' to add the dragon but not auto-refresh it."
                        }
                    </p>
                </div>
                <div className='flex justify-between items-center'>
                    <label htmlFor='tod'>Dies at:</label>
                    <TimePicker
                        id='tod'
                        onChange={setTOD}
                        value={tod}
                        format="mm:ss"
                        maxDetail='second'
                        disableClock={true} />
                </div>
                <div className='flex justify-between text-gray-400'>
                    <p>(Experimental!) Specify the minute and second the "will die if... " changes and FART will provide a TOD countdown. Dragon must be unfogged.</p>
                </div>
                <div className='flex items-end flex-col'>
                    <button className="rounded bg-indigo-500 px-2 py-1 hover:bg-indigo-700" onClick={handleAdd}>Add</button>
                </div>
            </div>
    );
}