import DragonInstancesInput from "./DragonInstancesInput";
import { generateDragCaveImgUrl } from "../app/functions";
import { CountDown } from './Clock';

const futureDate = new Date(Date.now() + (10 * 60000));
export default function DragonTR({code, instances, setInstances, rate, remove}){
    const   imgLink = generateDragCaveImgUrl(code, true),
            viewLink = `https://dragcave.net/view/${code}`;

    return (
        <div className="flex flex-col items-center">
            <i>({code})</i>
            <DragonInstancesInput
                    instances={instances}
                    setInstances={setInstances} />
            <span>~{(60000 / rate) * instances} <abbr title="views per minute">V/M</abbr></span>
            <span>
                <abbr title="time of death">TOD</abbr>&nbsp;
                <CountDown
                    to={futureDate}
                    whenDone={remove} />
            </span>
            <button
                className="bg-red-400 rounded px-2 py-1 my-1 hover:bg-red-600"
                onClick={remove}>Delete</button>
            <a href={viewLink} target="_blank" rel="noopener noreferrer">
                <img alt="dragon" src={imgLink} />
            </a>
        </div>
    );
}