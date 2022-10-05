const API_URL = import.meta.env.BASE_URL + "./api";

interface APIResponse {
    errors: boolean,
    acceptable: boolean,
    justHatched: boolean,
    errorMessage?: string,
    tod: number|null
}

export async function checkDragon (code: string, tod: number|null = null): Promise<APIResponse>{
    const
        url = API_URL + "/check/" + code + (tod ? "?tod="+tod : ''),
        response = await fetch(url);

    if(!response.ok)
        throw new Error(response.statusText);

    const json = await response.json();
    return json;
}