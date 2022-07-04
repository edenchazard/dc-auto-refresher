import { Dragon } from "../app/interfaces";
import { createShareLinkFromList } from "../app/functions";

export default function ShareLink({ list }: { list: Dragon[] }){
    const shareLink = createShareLinkFromList(list);

    function copy(){
        navigator.clipboard.writeText(shareLink);
    }

    return (
        <div>
            <div className="flex items-center justify-between my-2">
                <span>
                    <label htmlFor="share">Share Link:</label>
                </span>
                <span className="flex">
                    <input className='text-black w-full'
                        id='share'
                        type='text'
                        value={shareLink}
                        readOnly />
                    <button className="ml-2 rounded bg-indigo-500 px-2 py-1 hover:bg-indigo-700"
                        type='button'
                        onClick={copy}>Copy</button>
                </span>
            </div>
            <div className='flex justify-between text-gray-400'>
                <p>Share this setup with other users.</p>
            </div>
        </div>
    );
}