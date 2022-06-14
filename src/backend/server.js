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
function determineDragonDetails(dragon, ms){
    const calculateTOD = (hoursLeft, userMS) => {
        console.log("MILISECONDS XYZ", userMS)
        if(hoursLeft == -1)
            return null;
        
        // retrieve remaining hours after subtracting days
        // dc's hours are always ceiled and not precise
        // so we need to "add" the precision
        // work out the date in the future by assessing hoursleft
        // and the user specified minutes and seconds
        const x = new Date();
        x.setTime(userMS);
        const userDate = new Date();
        userDate.setUTCMinutes(x.getUTCMinutes());
        userDate.setUTCSeconds(x.getUTCSeconds());

        // if the current ms is higher than the user specified ms, then dc's
        // 'timer' has already ticked down
        //const remainder = hoursLeft % 6;
        userDate.setUTCHours(userDate.getUTCHours() + hoursLeft);
        /*if((new Date).getTime() < userDate.getTime()){
            userDate.setUTCHours(userDate.getUTCHours() - 1);
            console.log('yeah');
        }
        else{
            const remainder = hoursLeft % 6;
            console.log('reeee', remainder)
            userDate.setUTCHours(userDate.getUTCHours() + remainder);
        }*/

        console.log('user specified date ' + userDate);

        return userDate.getTime();
    }

    const
        isAdult = dragon.grow != 0,
        isDead = dragon.death != 0,
        isHidden = dragon.start == 0 && dragon.hatch == 0 && dragon.death == 0,
        isFrozen = !isAdult && !isDead && !isHidden && dragon.hoursleft == -1,
        justHatched = dragon.hoursleft === 168 && dragon.hatch != 0;

        console.log("MILISECONDS", ms)
    const tod = calculateTOD(dragon.hoursleft, ms);

    return { isAdult, isDead, isHidden, isFrozen, justHatched, tod };
}

router.get('/check/:code/:tod', async (ctx) => {
    const code = ctx.params.code;
    const userMS = ctx.params.tod;

    if(!validateCode(code)){
        ctx.body = { 
            errors: true,
            errorMessage: "The code isn't valid."
        };
        return;
    }

    const
        response = await axios(config.DCAPIURL+"/view/"+code),
        dragon = response.data?.dragons?.[code];

    if(!dragon){
        ctx.body = { 
            errors: true,
            errorMessage: "The dragon doesn't exist or there's an issue with dragcave.net."
        };
        return;
    }

    if(!validAPIDragon(dragon)){
        throw new Error("The API response from dragcave.net isn't valid.");
    }

    console.log(userMS)
    // extra info about the dragon based on response
    Object.assign(dragon, determineDragonDetails(dragon, userMS));

    ctx.body = {
        errors: false,
        acceptable: !dragon.isAdult && !dragon.isDead && !dragon.isFrozen,
        justHatched: dragon.justHatched,
        tod: dragon.tod
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
            ctx.body = { errors: true, errorMessage: err.message };
        }
    })
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(config.port);

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});