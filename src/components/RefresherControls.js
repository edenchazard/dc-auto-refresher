const Select = ({onChange, value}) =>{
    let options = [250, 500, 1000, 2000, 4000];
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}>
            {
                options.map((opt, index) =>{
                    return <option key={index} value={opt}>{opt}ms</option>
                })
            }
        </select>
    );
};

export default function RefresherControls({rate, update, click}) {
    return (
        <div>
            <Select value={rate} onChange={update} />
            <button onClick={click}>Toggle autorefresh</button>
        </div>
    );
}