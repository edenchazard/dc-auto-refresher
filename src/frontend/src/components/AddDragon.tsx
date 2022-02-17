import { useState } from 'react';
import DragonInstancesInput from "./DragonInstancesInput";

export default function AddDragon({addToList, rate}){
    const   [code, updateNewCode] = useState<string>(""),
            [instances, setInstances] = useState<number>(1);

    function handleAdd(){
        updateNewCode("");
        addToList(code, instances);
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
                <div className='flex justify-between text-gray-400'>
                    <p>Actual rate is dependent on different factors.</p>
                </div>
                <div className='flex items-end flex-col'>
                    <button className="rounded bg-indigo-500 px-2 py-1 hover:bg-indigo-700" onClick={handleAdd}>Add</button>
                </div>
            </div>
    );
}