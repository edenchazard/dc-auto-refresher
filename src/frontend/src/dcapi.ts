const API_URL = "/api";

export const DCAPI ={
    getHrsLeft: (code: string): Promise<number> => {
        return new Promise(async (resolve, reject) => {
            const url = API_URL+"/check/"+code;
            try{
                const response = await fetch(url);
                if(!response.ok){
                    reject("non 200 OK response received.");
                }

                const json = await response.json();
                resolve(json.hoursLeft);
            }
            catch(error){
                reject("non 200 OK response received.");
            }
        });
    }
}