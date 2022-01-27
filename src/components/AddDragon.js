import { useState } from 'react';
import DragonInstancesInput from "./DragonInstancesInput";

export default function AddDragon({addToList}){
    const [code, updateNewCode] = useState("");
    const [instances, setInstances] = useState(1);

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
                    onChange={(e) => updateNewCode(e.target.value)}/>
            </td>
            <td>
                <DragonInstancesInput
                    instances={instances}
                    setInstances={setInstances} />
            </td>
            <td>
                <button className="rounded bg-indigo-500 px-2 py-1" onClick={handleAdd}>Add</button>
            </td>
        </tr>
    );
}