const API_URL = process.env.PUBLIC_URL + "/api";

interface APIResponse {
    errors: boolean,
    acceptable: boolean,
    justHatched: boolean,
    errorMessage?: string,
    tod: number|null
}

const DCAPI ={
    checkDragon: async (code: string, tod: number|null = null): Promise<APIResponse> => {
        const
            url = API_URL + "/check/" + code + "?tod=" + tod,
            response = await fetch(url);

        if(!response.ok){
            throw new Error(response.statusText);
        }

        const json = await response.json();
        return json;
    }
}

export default DCAPI;