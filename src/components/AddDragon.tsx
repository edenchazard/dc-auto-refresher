import { useState } from 'react';
import DragonInstancesInput from "./DragonInstancesInput";

export default function AddDragon({addToList, rate}){
    const   [code, updateNewCode] = useState<string>(""),
            [instances, setInstances] = useState<number>(1);

    function handleAdd(){
        updateNewCode("");
        setInstances(1);
        addToList(code, instances);
    }

    return (
        <tr>
            <td>New</td>
            <td>
                <input
                    className='text-black'
                    type='text'
                    placeholder="Code"
                    value={code}
                    minLength={4}
                    maxLength={5}
                    onChange={(e) => updateNewCode(e.target.value)}/>
            </td>
            <td>
                <DragonInstancesInput
                    instances={instances}
                    setInstances={setInstances} />
            </td>
            <td>
                {(60000 / rate) * instances}
            </td>
            <td>
                <button className="rounded bg-indigo-500 px-2 py-1" onClick={handleAdd}>Add</button>
            </td>
        </tr>
    );
}