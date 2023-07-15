import { useEffect } from 'react';
import { generateDragCaveImgUrl } from '../utils/functions';
import type { Dragon } from '../app/types';

function makeDOMFavicon(url: string): HTMLLinkElement {
  const newIcon = document.createElement('link');
  newIcon.rel = 'icon';
  newIcon.href = url;
  return newIcon;
}

function replaceFavicon(url: string) {
  const link = document.head.querySelector('link[rel="icon"]');
  if (link !== null) document.head.replaceChild(makeDOMFavicon(url), link);
}

export default function useIconCycle(
  autorefresh: boolean,
  listOfDragons: Dragon[],
  defaultIconPath: string,
  interval = 1000,
) {
  // handle icon changes when auto refresh is active
  useEffect(() => {
    const originalPageTitle = document.title;
    const refreshableDragons = listOfDragons.filter(
      ({ instances }) => instances > 0,
    );
    let index = 0;
    let iconInterval: ReturnType<typeof setInterval>;

    // If the autorefresher is turned on, we should cycle the favicon.
    if (autorefresh) {
      const cycle = () => {
        if (refreshableDragons.length === 0) {
          clearInterval(iconInterval);
          return;
        }

        // go back to the beginning
        index = index + 1 === refreshableDragons.length ? 0 : index + 1;
        const code = refreshableDragons[index].code;
        replaceFavicon(generateDragCaveImgUrl(code, true));
        document.title = code;
      };

      // call cycler immediately and start up the interval,
      // this removes the one second 'lag' at the beginning
      cycle();
      iconInterval = setInterval(cycle, interval);
    }

    // clean up
    return () => {
      clearInterval(iconInterval);
      replaceFavicon(defaultIconPath);
      document.title = originalPageTitle;
    };
  }, [autorefresh, listOfDragons, defaultIconPath, interval]);
}
