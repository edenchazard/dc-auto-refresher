// normally I would refactor this script but it's sooooo small
const config = require('./config.js');
const Koa = require('koa');
const Router = require('@koa/router');
const axios = require("axios");
const app = new Koa();

function validateCode(code) {
    return /^[a-zA-Z0-9]{5}$/.test(code);
}

const router = new Router({ prefix: config.apiPath });

// Function to validate API response from dragcave
// Only checks the fields we need.
function validAPIDragon(responseObj){
    let pass = true;
    ['grow', 'death', 'start', 'hatch', 'hoursleft'].forEach((prop) => {
        if(typeof responseObj[prop] == 'undefined'){
            pass = false;
        }
    });

    return pass;
}

function determineDragonDetails(dragon){
    const
        isAdult = dragon.grow != 0,
        isDead = dragon.death != 0,
        isHidden = dragon.start == 0 && dragon.hatch == 0 && dragon.death == 0,
        isFrozen = !isAdult && !isDead && !isHidden && dragon.hoursleft == -1,
        justHatched = dragon.hoursleft === 168 && dragon.hatch != 0;

    return { isAdult, isDead, isHidden, isFrozen, justHatched };
}

router.get('/check/:code', async (ctx) => {
    try{
        const code = ctx.params.code;

        if(!validateCode(code)){
            throw new Error("The code isn't valid.");
        }

        const
            response = await axios(config.DCAPIURL+"/view/"+code),
            dragon = response.data?.dragons?.[code];

        if(!dragon){
            throw new Error("The code doesn't exist or there's an issue with dragcave.net.");
        }

        if(!validAPIDragon(dragon)){
            throw new Error("The API response from dragcave.net isn't valid.");
        }

        const { isAdult, isDead, isFrozen, justHatched } = determineDragonDetails(dragon);

        // ensure it's acceptable
        ctx.body = {
            acceptable: !isAdult && !isDead && !isFrozen,
            justHatched
        };
    }
    catch(err){
        ctx.status = 500;
        ctx.body = { errors: 1, message: err.message };
    }
});

app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch(err) {
        console.log(err)
        ctx.status = err.status || 500;
        ctx.body = { errors: 1, message: err.message };
    }
});

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(config.port);

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});