export default function DragonInstancesInput({instances, setInstances}){
    return (
        <input
            type='number'
            value={instances}
            min="1"
            max="10"
            size={2}
            onChange={(e) => setInstances(e.target.value)}
            className='text-black' />
    )
}