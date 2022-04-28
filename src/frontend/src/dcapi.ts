const API_URL = process.env.PUBLIC_URL + "/api";

interface APIResponse {
    errors: boolean,
    acceptable: boolean,
    justHatched: boolean,
    errorMessage?: string
}

const DCAPI ={
    checkDragon: async (code: string): Promise<APIResponse> => {
        const url = API_URL+"/check/"+code;
        try{
            const response = await fetch(url);
            if(!response.ok){
                throw new Error(response.statusText);
            }
            const json = await response.json();
            return json;
            
        }
        catch(error){
            console.log(error)
            throw new Error(error.message);
        }
    }
}

export default DCAPI;