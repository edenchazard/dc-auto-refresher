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

export function makeDOMFavicon(url: string): HTMLLinkElement{
    let newIcon = document.createElement('link');
    newIcon.rel = 'icon';
    newIcon.href = url;
    return newIcon;
}

export function replaceFavicon(url: string): HTMLLinkElement{
    return document.head.replaceChild(
        makeDOMFavicon(url),
        document.head.querySelector('link[rel="icon"]')
    );
}

export function sizesSame(oldSize: Size, newSize: Size): boolean{
    return (oldSize.w === newSize.w && oldSize.h === newSize.h);
}