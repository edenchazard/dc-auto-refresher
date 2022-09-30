interface APIDragon {
    id: string,
    name: string | null,
    owner: string,
    start: string,
    hatch: string,
    grow: number,
    death: string,
    views: number,
    unique: number,
    clicks: number,
    gender: "" | "Male" | "Female",
    hoursleft: number,
    parent_f: string,
    parent_m: string
}

interface DragonInferredDetails {
    isAdult: boolean,
    isDead: boolean,
    isHidden: boolean,
    isFrozen: boolean,
    justHatched: boolean,
    tod: number | null
}

type Dragon = APIDragon & DragonInferredDetails;

interface ConfigFile {
    port: number,
    apiPath: string,
    DCAPIURL: string,
    defaultError: { status: number, message: string }
}

export {
    APIDragon,
    DragonInferredDetails,
    Dragon,
    ConfigFile
}