import { useState } from 'react';

export default function AddDragon({addToList}){
    const [codeToAdd, updateNewCode] = useState("");

    function handleAdd(){
        updateNewCode("");
        addToList(codeToAdd);
    }

    return (
        <tr>
            <td>&nbsp;</td>
            <td>
                <input
                    type='text'
                    placeholder="Code"
                    value={codeToAdd}
                    onChange={(e) => updateNewCode(e.target.value)}/>
            </td>
            <td>
                &nbsp;
            </td>
            <td>
                <button onClick={handleAdd}>Add</button>
            </td>
        </tr>
    );
}