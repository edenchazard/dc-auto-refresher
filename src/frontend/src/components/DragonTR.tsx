import DragonInstancesInput from "./DragonInstancesInput";
import { generateDragCaveImgUrl } from "../app/functions";
import { CountDown } from './Clock';

const RateCalculator = ({ rate, instances }) => {
    const calculated = ((60000 / rate) * instances) || 0;
    let text;

    if(calculated === 0){
        text = <span>None</span>;
    }
    if(calculated > 0){
        text = <span>~{calculated} <abbr title="views per minute">V/M</abbr></span>;
    }
    if(rate === 0){
        text = <span>Variable</span>;
    }

    return text;
}

export default function DragonTR({code, instances, setInstances, rate, remove, tod}){
    const   imgLink = generateDragCaveImgUrl(code, true),
            viewLink = `https://dragcave.net/view/${code}`,
            diesOn = new Date(tod);

    return (
        <div className="flex flex-col items-center">
            <i>({code})</i>
            <DragonInstancesInput
                    instances={instances}
                    setInstances={setInstances} />
            <RateCalculator rate={rate} instances={instances} />
            {(tod
                ?   <span
                        data-tip={"TOD: " + diesOn.toLocaleString()}
                        data-event='click'>
                        <CountDown to={diesOn} />
                    </span>
                : "-----"
            )}
            <button
                className="bg-red-400 rounded px-2 py-1 my-1 hover:bg-red-600"
                onClick={remove}>Delete</button>
            <a href={viewLink} target="_blank" rel="noopener noreferrer">
                <img alt="dragon" src={imgLink} />
            </a>            
        </div>
    );
}