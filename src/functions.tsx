import { Dragon } from "./interfaces";

export function isCodeInList(listOfDragons: Dragon[], code: string): boolean{
    return !!listOfDragons.find((dragon) => dragon.code === code);
}

export function validateCode(code: string): boolean{
    return /^[a-zA-Z0-9]{4,5}$/.test(code);
}

// Generates a dragcave img url with a cachebust
export function generateDragCaveImgUrl(code: string): string{
    const cacheBust = Date.now() + Math.random();
    return `https://dragcave.net/image/${code}.gif?q=${cacheBust}`;
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