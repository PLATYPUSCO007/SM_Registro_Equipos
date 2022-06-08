const container = require('./src/startup/container');
const app = container.resolve('app');


try {
    app.start().then((connect_succes)=>{
        console.log('API ONLINE!');
    });
} catch (error) {
    console.log(error.message);
}