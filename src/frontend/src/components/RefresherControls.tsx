import type { Dragon } from '../app/interfaces';
import { Clock } from './Clock';
import Label from './Label';
import ShareSetup from './ShareSetup';
import RefreshRateSelect from './RefreshRateSelect';
import { ToggleButton } from './Buttons';
import { hasRefreshableDragons } from '../app/functions';

interface RefresherControlsProps {
  list: Dragon[];
  rate: number;
  updateRate: (value: number) => void;
  click: () => void;
  autorefresh: boolean;
  smartRemoval: boolean;
  updateSmartRemoval: (value: boolean) => void;
  noView: boolean;
  updateNoView: (value: boolean) => void;
}
export default function RefresherControls({
  list,
  rate,
  updateRate,
  click,
  autorefresh,
  smartRemoval,
  updateSmartRemoval,
  noView,
  updateNoView,
}: RefresherControlsProps) {
  const disabled = !hasRefreshableDragons(list);
  return (
    <div className="flex flex-col gap-3">
      <div
        className={smartRemoval ? '' : 'opacity-70'}
        onClick={() => {
          updateSmartRemoval(!smartRemoval);
        }}
      >
        <div className={`text-white flex justify-between items-center`}>
          <Label
            id="smartRemoval"
            // Prevent label from "doubling up" our check behaviour
            onClick={(e) => {
              e.preventDefault();
            }}
            text="Smart removal"
          />
          <input
            type="checkbox"
            id="smartRemoval"
            aria-describedby="smart-removal-description"
            checked={smartRemoval}
            onChange={(e) => {
              updateSmartRemoval(e.target.checked);
            }}
          />
        </div>
        <div className="text-stone-400">
          <p id="smart-removal-description">
            If enabled, Smart removal will try to detect changes for each dragon
            and remove freshly hatched eggs or newly grown adults however with
            some breeds this may not be accurate.
          </p>
        </div>
      </div>
      <div
        className={noView ? '' : 'opacity-70'}
        onClick={() => {
          updateNoView(!noView);
        }}
      >
        <div className={`text-white flex justify-between items-center`}>
          <Label
            id="no-views"
            text="Disable views"
            // Prevent label from "doubling up" our check behaviour
            onClick={(e) => {
              e.preventDefault();
            }}
          />
          <input
            type="checkbox"
            id="no-views"
            aria-describedby="no-views-description"
            checked={noView}
            onChange={(e) => {
              updateNoView(e.target.checked);
            }}
          />
        </div>
        <div className="text-stone-400">
          <p id="no-views-description">
            If enabled, views will be prevented from accumulating but dragons
            will still auto-refresh.
          </p>
        </div>
      </div>
      {list.length > 0 && (
        <div>
          <ShareSetup list={list} />
        </div>
      )}
      <div className="flex items-center justify-between">
        <Label
          id="timer"
          text="Your local time"
        />
        <time
          id="timer"
          role="timer"
        >
          <Clock />
        </time>
      </div>
      <div className="flex flex-col gap-y-2 gap-x-3 flex-wrap items-stretch xxs:flex-row xxs:items-center">
        <Label
          id="rate"
          text="Refresh Interval"
        />
        <RefreshRateSelect
          className="text-black flex-1 "
          id="rate"
          value={rate}
          onChanged={updateRate}
        />
        {
          // AR enabled
          <ToggleButton
            className="button-purple flex-1 min-w-[9rem]"
            onClick={click}
            disabled={disabled}
            pressed={autorefresh}
            title={
              disabled
                ? 'No dragons to auto-refresh'
                : autorefresh
                ? 'Stop auto-refresher'
                : 'Start auto-refresher'
            }
          >
            {disabled ? 'No dragons' : autorefresh ? 'Stop' : 'Start'}
          </ToggleButton>
        }
      </div>
    </div>
  );
}
