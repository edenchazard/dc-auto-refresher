import { type Dragon } from '../app/types';
import CopyButton from './CopyButton';
import { createShareLinkFromList } from '../utils/functions';
import Label from './Label';

export default function ShareSetup({ list }: { list: Dragon[] }) {
  const shareLink = createShareLinkFromList(list);

  return (
    <>
      <div className="xxs:flex-row xxs:items-center flex flex-col flex-wrap items-stretch gap-x-3 gap-y-2">
        <Label
          id="share"
          text="Share Link"
        />
        <div className="xxs:flex-row flex flex-1 flex-col items-stretch">
          <input
            className="xxs:rounded-l-sm xxs:rounded-r-none flex-1 rounded-b-none"
            id="share"
            type="text"
            value={shareLink}
            readOnly
          />
          <CopyButton
            className="button-purple xxs:rounded-l-none xxs:rounded-r min-w-28 rounded-t-none"
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
