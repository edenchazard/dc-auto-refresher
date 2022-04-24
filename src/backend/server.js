// normally I would refactor this script but it's sooooo small
const config = require('./config.js');
const Koa = require('koa');
const Router = require('@koa/router');
const axios = require("axios");
const app = new Koa();
const router = new Router({ prefix: config.apiPath });

function validateCode(code) {
    return /^[a-zA-Z0-9]{5}$/.test(code);
}

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

// Determines various characteristics about a dragon
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
    const code = ctx.params.code;

    if(!validateCode(code)){
        ctx.body = { 
            errors: true,
            message: "The code isn't valid."
        };
        return;
    }

    const
        response = await axios(config.DCAPIURL+"/view/"+code),
        dragon = response.data?.dragons?.[code];

    if(!dragon){
        ctx.body = { 
            errors: true,
            message: "The dragon doesn't exist or there's an issue with dragcave.net."
        };
        return;
    }

    if(!validAPIDragon(dragon)){
        throw new Error("The API response from dragcave.net isn't valid.");
    }

    // extra info about the dragon based on response
    Object.assign(dragon, determineDragonDetails(dragon));

    ctx.body = {
        errors: false,
        acceptable: !dragon.isAdult && !dragon.isDead && !dragon.isFrozen,
        justHatched: dragon.justHatched
    };
});

app
    .use(async (ctx, next) => {
        try {
            await next();
        }
        catch(err) {
            console.log(err)
            ctx.status = err.status || 500;
            ctx.body = { errors: true, message: err.message };
        }
    })
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(config.port);

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});