import { type Dragon } from '../app/interfaces';
import CopyButton from './CopyButton';
import { createShareLinkFromList } from '../app/functions';
import Label from './Label';

export default function ShareSetup({ list }: { list: Dragon[] }) {
  const shareLink = createShareLinkFromList(list);

  return (
    <>
      <div className="flex flex-col gap-2 items-stretch flex-wrap xxs:flex-row xxs:items-center">
        <Label
          id="share"
          text="Share Link"
        />
        <div className="flex flex-col flex-1 justify-end xxs:flex-row">
          <input
            className="flex-1 text-black rounded-b-none xxs:rounded-l-sm xxs:rounded-r-none"
            id="share"
            type="text"
            value={shareLink}
            readOnly
          />
          <CopyButton
            className="button-purple w-full min-w-[5rem] rounded-t-none xxs:rounded-l-none xxs:rounded-r"
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
