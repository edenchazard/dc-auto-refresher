import { Dragon } from "./interfaces";

export function isCodeInList(listOfDragons: Dragon[], code: string): boolean{
    return !!listOfDragons.find((dragon) => dragon.code === code);
}

export function validateCode(str: string): boolean{
    return /^[a-zA-Z0-9]{4,5}$/.test(str);
}