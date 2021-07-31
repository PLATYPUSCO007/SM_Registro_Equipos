const container = require('./src/startup/container');
const app = container.resolve('app');


try {
    app.start().then((connect_succes)=>{
        console.log(connect_succes);
    });
} catch (error) {
    console.log(error.message);
}