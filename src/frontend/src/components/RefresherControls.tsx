import { Clock } from "./Clock";
import ShareLink from "./ShareLink";

const Select = ({onChange, value}) =>{
    const options = [250, 500, 1000, 2000, 4000].map(
        opt => ({ label: (opt / 1000) + "s", value: opt}));

    options.push({ label: "Adaptive", value: 0 });

    return (
        <select
            id='rate'
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className='text-black'>
            {
                options.map((opt, index) =>{
                    return <option key={index} value={opt.value}>{opt.label}</option>
                })
            }
        </select>
    );
};

export default function RefresherControls({list, rate, updateRate, click, autorefresh, smartRemoval, updateSmartRemoval}) {
    return (
        <div>
            <div
                className="my-2"
                onClick={() => updateSmartRemoval(!smartRemoval)}>
                <div className={`${smartRemoval ? 'text-white' : 'text-gray-400' } flex justify-between items-center`}>
                    <label
                        htmlFor='smartRemoval'
                        // Prevent label from "doubling up" our check behaviour
                        onClick={(e) => e.preventDefault() }>Smart removal:</label>
                    <input
                        type='checkbox'
                        id='smartRemoval'
                        checked={smartRemoval}
                        onChange={(e) => updateSmartRemoval(e.target.checked)} />
                </div>
                <div
                    className={`${smartRemoval ? 'text-gray-400' : 'text-gray-600' }`}
                    id="smart-removal">
                    <p>Smart removal will try to detect changes for each dragon and remove freshly hatched eggs or newly grown adults however with some breeds this may not be accurate.</p>
                </div>
            </div>
            {
                list.length > 0 &&
                <div className="my-2">
                    <ShareLink list={list} />
                </div>
            }
            <div className="my-2">
                <div className="flex items-center justify-between">
                    <span>
                        <label htmlFor="timer">Local time:</label>
                    </span>
                    <span role="timer" id='timer'>
                        <Clock />
                    </span>
                </div>
            </div>
            <div className="my-2">
                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor='rate'>Rate: </label>
                        <Select value={rate} onChange={updateRate} />
                    </div>
                    <div>
                    {
                        //AR enabled
                        (autorefresh ? <button onClick={click} className="rounded bg-blue-600 px-2 py-1 hover:bg-blue-400">Stop</button>
                                    : <button onClick={click} className="rounded bg-blue-300 px-2 py-1 hover:bg-blue-500">Start</button>)
                    }
                    </div>
                </div>
            </div>
        </div>
    );
}