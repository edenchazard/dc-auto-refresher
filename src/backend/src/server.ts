// normally I would refactor this script but it's sooooo small
import config from './config';
import Koa from 'koa';
import Router from '@koa/router';
import axios from "axios";
import { APIDragon, Dragon, DragonInferredDetails } from './types';

const app = new Koa();
const router = new Router({ prefix: config.apiPath });

function validateCode(code: string) {
    return /^[a-zA-Z0-9]{5}$/.test(code);
}

// Function to validate API response from dragcave
// Only checks the fields we need.
function validAPIDragon(responseObj: APIDragon){
    let pass = true;
    ['grow', 'death', 'start', 'hatch', 'hoursleft'].forEach((prop) => {
        if(prop in responseObj === false)
            pass = false;
    });

    return pass;
}

// Determines various characteristics about a dragon
function determineDragonDetails(dragon: APIDragon, seconds: number){
    // We need to compare the current seconds passed this hour with that of
    // what the user inputted, then we set the tod to the current date +
    // the hours, mins and seconds of the dragon remaining
    const calculateTOD = (hoursLeft: number, seconds: number) => {
        if(hoursLeft == -1) return null;

        const now = new Date();
        const a = (now.getUTCMinutes() * 60) + (now.getUTCSeconds());

        // is hoursleft rounded? let's find out
        const hours = now.getUTCHours() + hoursLeft;
        const roundedHours = a >= seconds ? hours : hours - 1;

        // create the date in the future
        const tod = new Date();
        tod.setUTCHours(roundedHours, Math.floor(seconds / 60), seconds % 60);

        //console.log('user specified date ' + tod);

        return tod.getTime();
    }

    const
        isAdult = dragon.grow != 0,
        isDead = dragon.death !== "0",
        isHidden = dragon.start === "0" && dragon.hatch === "0" && dragon.death === "0",
        isFrozen = !isAdult && !isDead && !isHidden && dragon.hoursleft == -1,
        justHatched = dragon.hoursleft === 168 && dragon.hatch !== "0";

    const tod = (seconds !== null ? calculateTOD(dragon.hoursleft, seconds) : null);

    const inferred: DragonInferredDetails = { isAdult, isDead, isHidden, isFrozen, justHatched, tod };
    return inferred;
}

router.get('/check/:code', async (ctx) => {
    const code: string = ctx.params.code;

    // force a number or make it null
    const seconds = Number(ctx.query.tod); 

    if(!validateCode(code)){
        ctx.body = { 
            errors: true,
            errorMessage: "The code isn't valid."
        };
        return;
    }

    const dcAPI = await axios(config.DCAPIURL+"/view/"+code);
    const response: APIDragon = dcAPI.data?.dragons?.[code];

    if(!response){
        ctx.body = { 
            errors: true,
            errorMessage: "The dragon doesn't exist or there's an issue with dragcave.net."
        };
        return;
    }

    if(!validAPIDragon(response))
        throw new Error("The API response from dragcave.net isn't valid.");

    // extra info about the dragon based on response
    const dragon: Dragon = { ...response, ...determineDragonDetails(response, seconds) };
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
        // TODO: I don't like the any but ts complains if it isn't
        catch(err: any) {
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