export default function DragonInstancesInput({instances, setInstances}){
    return (
        <input
            type='number'
            value={instances}
            min="0"
            max="50"
            size={2}
            placeholder="instances"
            onChange={(e) => setInstances(Math.abs(parseInt(e.target.value)))}
            className='text-black' />
    )
}