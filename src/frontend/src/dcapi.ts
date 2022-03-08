const API_URL = process.env.PUBLIC_URL + "/api";

export const DCAPI ={
    checkDragon: (code: string): Promise<any> => {
        return new Promise(async (resolve, reject) => {
            const url = API_URL+"/check/"+code;
            try{
                const response = await fetch(url);
                if(!response.ok){
                    reject("non 200 OK response received.");
                }

                const json = await response.json();
                resolve(json);
            }
            catch(error){
                reject("non 200 OK response received.");
            }
        });
    }
}