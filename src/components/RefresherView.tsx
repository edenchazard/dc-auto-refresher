import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { clearInterval, setInterval, setTimeout } from 'worker-timers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';

import type { Size, Dragon } from '../app/types';
import { generateDragCaveImgUrl, sizesSame } from '../utils/functions';

/*

// The number of images we are expecting to load
// usememo so we don't recalculate it unless the list changes
const imagesToLoad = useMemo(() => calculateNumberOfImages(dragonList), [ dragonList ]);


    
function calculateNumberOfImages(listOfDragons: Dragon[]): number {
    let value = 0;
    listOfDragons.forEach(({ instances }) => value += instances);
    return value;
}
*/
interface RefresherViewProps {
  dragonList: Dragon[];
  rate: number;
  disableViews: boolean;
  onImageChange?: (code: string) => void;
}

type ImageWithDataset = HTMLImageElement & { dataset: { code: string } };

export default function RefresherView({
  dragonList,
  rate,
  disableViews,
  onImageChange,
}: RefresherViewProps) {
  const [instance, setInstance] = useState<number>(1);
  const sizes = useRef<Record<string, Size>>({});

  // force a re-render every rate, this works because
  // the browser thinks the images are new every time
  // with the cachebust rendering the dragons
  useEffect(() => {
    if (rate === 0) return;

    const timeout = setInterval(() => {
      setInstance((prev) => prev + 1);
    }, rate);

    return () => {
      clearInterval(timeout);
    };
  }, [rate]);

  // we try to detect changes in the image's h/w after load
  // and assume if there's any change, that the
  // dragon has been fogged/hatched/adulted/died
  // this is more efficient, faster than constantly polling the DC API
  function compareSizes(code: string, currentSize: Size) {
    // this is the first time we've grabbed the size
    if (sizes.current[code] !== undefined) {
      // a size change indicates a change in status
      if (!sizesSame(sizes.current[code], currentSize)) {
        onImageChange?.(code);
      }
    }
    // update with new measurements
    sizes.current[code] = currentSize;
  }

  function updateImage(img: ImageWithDataset) {
    const code = img.dataset.code;

    // immediately replace the src with a new one
    img.src = generateDragCaveImgUrl(code, disableViews);
  }

  function handleLoad(event: React.SyntheticEvent<ImageWithDataset, Event>) {
    const img = event.currentTarget;
    const sizing: Size = { w: img.naturalWidth, h: img.naturalHeight };

    // run size measuring for smart removal, if enabled
    if (onImageChange !== undefined) {
      compareSizes(img.dataset.code, sizing);
    }

    // we only run this if the rate is in adaptive mode
    if (rate === 0) {
      updateImage(img);
    }
  }

  // handle image failures in adaptive mode
  function handleError(event: React.SyntheticEvent<ImageWithDataset, Event>) {
    if (rate === 0) {
      const img = event.currentTarget;

      // retry in 2s
      setTimeout(() => {
        updateImage(img);
      }, 2000);
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between my-2">
        <p>
          {rate > 0
            ? ` Refreshing every ${rate / 1000}s (cycle #${instance})`
            : ' Refreshing at device rate'}
        </p>
        <FontAwesomeIcon
          icon={faRefresh}
          className="spin"
        />
      </div>
      <div>
        {dragonList.map((dragon: Dragon, index: number) => {
          return Array.from(Array(dragon.instances), (e, it) => (
            <img
              className="inline"
              src={generateDragCaveImgUrl(dragon.code, disableViews)}
              key={`${index}.${it}`}
              alt={dragon.code}
              data-code={dragon.code}
              onLoad={handleLoad}
              onError={handleError}
            />
          ));
        })}
      </div>
    </div>
  );
}
