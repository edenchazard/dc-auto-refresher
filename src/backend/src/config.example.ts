import { ConfigFile } from "./types";

const API_KEY = 'YOUR API KEY HERE';

const config: ConfigFile = {
    port: 80,
    apiPath: "/api",
    DCAPIURL: `https://dragcave.net/api/${API_KEY}/json`,
    defaultError: { status: 2, message: "Sorry, an error has occurred." },
};

export default config;