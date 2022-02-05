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

export default function RefresherControls({rate, updateRate, click, autorefresh, smartRemoval, updateSmartRemoval}) {
    return (
        <div className="space-y-1 my-1">
            <div className="flex justify-between">
                <label htmlFor='smartRemoval'>Smart removal:</label>
                <input
                    type='checkbox'
                    id='smartRemoval'
                    checked={smartRemoval}
                    onChange={(e) => updateSmartRemoval(e.target.checked)} />
            </div>
            <div className="flex items-center justify-between my-2">
                <div>
                    <label htmlFor='rate'>Rate:</label>
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