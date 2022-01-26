import "./Dragon.css";

export default function Dragon({code, instances, updateInstances, remove}){
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
                <input
                    type='number'
                    value={instances}
                    min="1"
                    max="10"
                    onChange={(e) => updateInstances(e.target.value)} />
            </td>
            <td>
                <button onClick={remove}>Delete</button>
            </td>
        </tr>
    );
}