const API_URL = process.env.PUBLIC_URL + "/api";

interface APIResponse {
    acceptable: boolean,
    justHatched?: boolean
}

const DCAPI ={
    checkDragon: async (code: string): Promise<APIResponse> => {
        const url = API_URL+"/check/"+code;
        try{
            const response = await fetch(url);
            if(!response.ok){
                throw new Error("non 200 OK response received.");
            }

            const json = await response.json();
            return json;
        }
        catch(error){
            throw new Error("non 200 OK response received.");
        }
    }
}

export default DCAPI;