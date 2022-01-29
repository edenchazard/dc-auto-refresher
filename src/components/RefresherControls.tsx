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

export default function RefresherControls({rate, update, click, autorefresh}) {
    return (
        <div className="flex items-center justify-between my-2">
            <div>
                <label htmlFor='rate'>Rate: </label>
                <Select value={rate} onChange={update} />
            </div>
            <div>
            {
                //AR enabled
                (autorefresh ? <button onClick={click} className="rounded bg-blue-600 px-2 py-1 hover:bg-blue-400">Turn off autorefresh</button>
                            : <button onClick={click} className="rounded bg-blue-300 px-2 py-1 hover:bg-blue-500">Turn on autorefresh</button>)
            }
            </div>
            
        </div>
    );
}