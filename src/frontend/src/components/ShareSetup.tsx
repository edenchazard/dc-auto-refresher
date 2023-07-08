import { type Dragon } from '../app/types';
import CopyButton from './CopyButton';
import { createShareLinkFromList } from '../app/functions';
import Label from './Label';

export default function ShareSetup({ list }: { list: Dragon[] }) {
  const shareLink = createShareLinkFromList(list);

  return (
    <>
      <div className="flex flex-col gap-y-2 gap-x-3 items-stretch flex-wrap xxs:flex-row xxs:items-center">
        <Label
          id="share"
          text="Share Link"
        />
        <div className="flex flex-col items-stretch flex-1 xxs:flex-row">
          <input
            className="flex-1 rounded-b-none xxs:rounded-l-sm xxs:rounded-r-none"
            id="share"
            type="text"
            value={shareLink}
            readOnly
          />
          <CopyButton
            className="button-purple min-w-[7rem] rounded-t-none xxs:rounded-l-none xxs:rounded-r"
            copyText={shareLink}
          />
        </div>
      </div>
      <div className="text-stone-400">
        <p>Share this setup with other users.</p>
      </div>
    </>
  );
}
