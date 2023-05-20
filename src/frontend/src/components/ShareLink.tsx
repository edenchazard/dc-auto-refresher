import { type Dragon } from '../app/interfaces';
import CopyButton from './CopyButton';
import { createShareLinkFromList } from '../app/functions';

export default function ShareLink({ list }: { list: Dragon[] }) {
  const shareLink = createShareLinkFromList(list);

  return (
    <>
      <div className="flex items-center justify-between">
        <span>
          <label htmlFor="share">Share Link:</label>
        </span>
        <span className="flex">
          <input
            className="text-black w-full"
            id="share"
            type="text"
            value={shareLink}
            readOnly
          />
          <CopyButton
            className="ml-2 rounded bg-indigo-500 px-2 py-1 hover:bg-indigo-700"
            text="Copy"
            copyText={shareLink}
          />
        </span>
      </div>
      <div className="text-gray-400">
        <p>Share this setup with other users.</p>
      </div>
    </>
  );
}
