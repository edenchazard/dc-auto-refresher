import { useEffect } from 'react';
import { generateDragCaveImgUrl } from "../app/functions";
import { Dragon } from '../app/interfaces';

function makeDOMFavicon(url: string): HTMLLinkElement{
    let newIcon = document.createElement('link');
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
        // we only want to show dragons that have at least one instance
        // this avoids showing dragons we've set up but don't want to 
        // AR yet
        const refreshableDragons = listOfDragons.filter(dragon => dragon.instances > 0);

        let
            index = 0,
            iconInterval = null;

        if(autorefresh){
            iconInterval = window.setInterval(() => {
                index = !refreshableDragons[index + 1] ? 0 : index + 1;
                const code = refreshableDragons[index].code;
                replaceFavicon(generateDragCaveImgUrl(code, true));
                document.title = code;
            }, 1000);
        }
        
        // clean up
        return () => {
            window.clearInterval(iconInterval);
            replaceFavicon('./logo192.png');
            document.title = process.env.REACT_APP_APP_TITLE;
        }
    }, [autorefresh, listOfDragons]);
}