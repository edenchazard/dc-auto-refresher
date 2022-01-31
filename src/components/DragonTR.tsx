import DragonInstancesInput from "./DragonInstancesInput";

export default function DragonTR({code, instances, setInstances, rate, remove}){
    const   imgLink = `https://dragcave.net/image/${code}.gif`,
            viewLink = `https://dragcave.net/view/${code}`;

    return (
        <div className="flex flex-col items-center">
            <i>({code})</i>
            <DragonInstancesInput
                    instances={instances}
                    setInstances={setInstances} />
            <span>{(60000 / rate) * instances} <abbr title="views per minute">V/M</abbr></span>
            <button
                className="bg-red-400 rounded px-2 py-1 my-1 hover:bg-red-600"
                onClick={remove}>Delete</button>
            <a href={viewLink} target="_blank" rel="noopener noreferrer">
                <img alt="dragon" src={imgLink} />
            </a>
        </div>
    );
}