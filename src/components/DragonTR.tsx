import "./Dragon.css";
import DragonInstancesInput from "./DragonInstancesInput";

export default function DragonTR({code, instances, setInstances, remove}){
    const imgLink = `https://dragcave.net/image/${code}.gif`;
    const viewLink = `https://dragcave.net/view/${code}`;

    return (
        <tr>
            <td>
                <a href={viewLink} target="_blank" rel="noopener noreferrer">
                    <img alt="dragon" src={imgLink} />
                </a>
            </td>
            <td><i>({code})</i></td>
            <td>
                <DragonInstancesInput
                    instances={instances}
                    setInstances={setInstances} />
            </td>
            <td>
                <button onClick={remove}>Delete</button>
            </td>
        </tr>
    );
}