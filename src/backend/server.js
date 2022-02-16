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
router.get('/check/:code', async (ctx) => {
    try{
        const code = ctx.params.code;

        if(!validateCode){
            throw new Error();
        }

        const response = await axios(config.DCAPIURL+"/view/"+code);
        const dragon = response?.data?.dragons[code];

        if(!dragon){
            ctx.body = { errors: 1, message: "The dragon could not be verified." };
        }
        else{
            ctx.body = { hoursLeft: dragon.hoursleft || -1 };
        }
    }
    catch(err){
        console.log(err)
        ctx.status = 500;
        ctx.body = { errors: 1, message: "Sorry, an error has occurred." };
    }
});

app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch(err) {
        console.log(err.status)
        ctx.status = err.status || 500;
        ctx.body = err.message;
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