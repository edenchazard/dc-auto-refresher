import { useEffect } from 'react';
import { generateDragCaveImgUrl } from "../app/functions";
import { Dragon } from '../app/interfaces';

function makeDOMFavicon(url: string): HTMLLinkElement{
    const newIcon = document.createElement('link');
    newIcon.rel = 'icon';
    newIcon.href = url;
    return newIcon;
}

function replaceFavicon(url: string): HTMLLinkElement{
    return document.head.replaceChild(
        makeDOMFavicon(url),
        document.head.querySelector('link[rel="icon"]')
    );
}

export default function useIconCycle(autorefresh: boolean, listOfDragons: Dragon[]){
    // handle icon changes when auto refresh is active
    useEffect(() => {
        const refreshableDragons = listOfDragons.filter(({instances}) => instances > 0);
        let
            index = 0,
            iconInterval = null;

        if(autorefresh){
            const cycle = () => {
                if(refreshableDragons.length === 0)
                   return clearInterval(iconInterval);

                index = !refreshableDragons[index + 1] ? 0 : index + 1;
                const code = refreshableDragons[index].code;
                replaceFavicon(generateDragCaveImgUrl(code, true));
                document.title = code;
            };

            // call cycler immediately and start up the interval,
            // this removes the one second 'lag' at the beginning
            cycle();
            iconInterval = setInterval(cycle, 1000);
        }
        
        // clean up
        return () => {
            clearInterval(iconInterval);
            replaceFavicon('./logo192.png');
            document.title = process.env.REACT_APP_APP_TITLE;
        }
    }, [autorefresh, listOfDragons]);
}