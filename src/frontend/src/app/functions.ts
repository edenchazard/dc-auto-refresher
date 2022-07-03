import { Dragon, Size } from "./interfaces";

export function isCodeInList(listOfDragons: Dragon[], code: string): boolean{
    return !!listOfDragons.find((dragon) => dragon.code === code);
}

export function validateCode(code: string): boolean{
    return /^[a-zA-Z0-9]{5}$/.test(code);
}

// Generates a dragcave img url with a cachebust
export function generateDragCaveImgUrl(code: string, noView: boolean = false): string{
    const cacheBust = Date.now() + Math.random();
    // no view disables views on the dragon
    return `https://dragcave.net/image/${code}${noView ? '/1' : ''}.gif?q=${cacheBust}`;
}

export function sizesSame(oldSize: Size, newSize: Size): boolean{
    return (oldSize.w === newSize.w && oldSize.h === newSize.h);
}

export function getListFromQS(url: string = window.location.search){
    const query = new URLSearchParams(url);
    const unserialize: Dragon[] = [];

    if(query.has('list')){
        const dragons = query.get('list').split(';');
        for(const dragon of dragons){
            const
                data =  dragon.split(','),
                code = data[0],
                instances = (data[1] == null ? null : parseInt(data[1])),
                tod = (data[2] == null ? null : parseInt(data[2]));
            
            // todo: validate each value
            unserialize.push({ code, instances, tod });
        }

        window.history.replaceState({list: ''}, '', '/dc/auto-refresher/');
    }

    return (unserialize.length > 0 ? unserialize : null);
}

export function createShareLinkFromList(list: Dragon[]){
    const map = ({ code, instances, tod }) => 
        `${code},${instances},${(isNaN(tod) ? 'null' : tod )}`;

    return window.location.href + "?list=" +
        list
            .map(map)
            .join(';');
}