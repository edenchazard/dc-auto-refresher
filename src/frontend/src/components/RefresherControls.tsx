import { Clock } from "./Clock";
import ShareLink from "./ShareLink";

const Select = ({onChange, value}) =>{
    let options: number[] = [250, 500, 1000, 2000, 4000];
    return (
        <select
            id='rate'
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className='text-black'>
            {
                options.map((opt, index) =>{
                    return <option key={index} value={opt}>{opt / 1000}s</option>
                })
            }
        </select>
    );
};

export default function RefresherControls({list, rate, updateRate, click, autorefresh, smartRemoval, updateSmartRemoval}) {
    return (
        <div className="space-y-1 my-1">
            <div className={`${smartRemoval ? 'text-white' : 'text-gray-400' } flex justify-between items-center`}>
                <label htmlFor='smartRemoval'>Smart removal:</label>
                <input
                    type='checkbox'
                    id='smartRemoval'
                    checked={smartRemoval}
                    onChange={(e) => updateSmartRemoval(e.target.checked)} />
            </div>
            <div id="smart-removal" className={`${smartRemoval ? 'text-gray-400' : 'text-gray-600' }`}>
                <p>Smart removal will try to detect changes for each dragon and remove freshly hatched eggs or newly grown adults however with some breeds this may not be accurate.</p>
            </div>
            {
                list.length > 0 && <ShareLink list={list} />
            }
            
            <div className="flex items-center justify-between my-2">
                <span>
                    <label htmlFor="timer">Local time:</label>
                </span>
                <span role="timer" id='timer'>
                    <Clock />
                </span>
            </div>
            <div className="flex items-center justify-between my-2">
                <div>
                    <label htmlFor='rate'>Rate: </label>
                    <Select value={rate} onChange={updateRate} />
                </div>
                <div>
                {
                    //AR enabled
                    (autorefresh ? <button onClick={click} className="rounded bg-blue-600 px-2 py-1 hover:bg-blue-400">Turn off autorefresh</button>
                                : <button onClick={click} className="rounded bg-blue-300 px-2 py-1 hover:bg-blue-500">Turn on autorefresh</button>)
                }
                </div>
            </div>
        </div>
    );
}