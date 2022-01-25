import "./Dragon.css";

export default function Dragon({code, repeat, updateRepeat}){
    const imgLink = `https://dragcave.net/image/${code}.gif`;
    
    function handleRepeat(){
    }

    return (
        <tr>
            <td><img src={imgLink} /></td>
            <td><i>({code})</i></td>
            <td>
                <input
                    onChange={handleRepeat}
                    type='number'
                    value={repeat} />
            </td>
        </tr>
    );
}