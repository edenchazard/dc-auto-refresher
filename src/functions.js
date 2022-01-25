export function isCodeInList(listOfDragons, code){
    const t = !!listOfDragons.find((dragon) => dragon.code === code);
    console.log(t)
    return t;
}

export function validateCode(str){
    return /^[a-zA-Z0-9]{4,5}$/.test(str);
}

