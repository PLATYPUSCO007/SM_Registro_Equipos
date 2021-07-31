const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const body_parser = require('body-parser');

require('express-async-errors');

module.exports = function({BDRoutes}){
    const router = express.Router();
    const apiRoute = express.Router();

    apiRoute.use(express.json()).use(cors()).use(helmet()).use(compression());
    apiRoute.use('/BD', BDRoutes);

    router.use("/v1/api", apiRoute);

    return router;
}