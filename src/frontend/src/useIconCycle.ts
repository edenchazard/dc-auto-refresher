import { useEffect } from 'react';
import { replaceFavicon, generateDragCaveImgUrl } from "./functions";

export default function useIconCycle(autorefresh, listOfDragons){
    // handle icon changes when auto refresh is active
    useEffect(() => {
        let index = 0;
        let iconInterval = null;

        if(autorefresh){
            iconInterval = window.setInterval(() => {
                index = !listOfDragons[index + 1] ? 0 : index + 1;
                const code = listOfDragons[index].code;
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