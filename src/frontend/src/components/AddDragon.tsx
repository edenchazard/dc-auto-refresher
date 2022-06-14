import TimePicker from 'react-time-picker';

import { useState } from 'react';
import DragonInstancesInput from "./DragonInstancesInput";

export default function AddDragon({addToList, rate}){
    const   [code, updateNewCode] = useState<string>(""),
            [instances, setInstances] = useState<number>(1),
            [tod, setTOD] = useState<string>();

    function handleAdd(){
        updateNewCode("");
        const [, mins, seconds ] = tod.split(":");
        const ms = (parseInt(mins) * 60000) + (parseInt(seconds) * 1000);
        addToList(code, instances, ms);
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
                        onChange={(e) => updateNewCode(e.target.value)}/>
                </div>
                <div className='flex justify-between items-center'>
                    <label htmlFor='instances'>Instances:</label>
                    <DragonInstancesInput
                        instances={instances}
                        setInstances={setInstances} />
                </div>
                <div className='flex justify-between items-center'>
                    At {(60000 / rate) * instances} views per minute
                </div>
                <div className='flex justify-between items-center'>
                    <label htmlFor='tod'>TOD:</label>
                    <TimePicker
                        id='tod'
                        onChange={setTOD}
                        value={tod}
                        format="-- m:s"
                        maxDetail='second' />
                </div>
                <div className='flex justify-between text-gray-400'>
                    <p>Actual rate is dependent on different factors.</p>
                </div>
                <div className='flex items-end flex-col'>
                    <button className="rounded bg-indigo-500 px-2 py-1 hover:bg-indigo-700" onClick={handleAdd}>Add</button>
                </div>
            </div>
    );
}