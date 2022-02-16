const API_KEY = 'TEST';

module.exports = {
    port: 8080,
    apiPath: "/api",
    default_error: { status: 2, message: "Sorry, an error has occurred." },
    APIURL: `https://dragcave.net/api/${API_KEY}/json`
}