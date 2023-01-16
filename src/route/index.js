const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const body_parser = require('body-parser');
const cookieSession = require('cookie-session');

const {AuthMiddleware} = require('../middleware');

require('express-async-errors');

module.exports = function ({ BDRoutes, AuthRoutes, PDFRoutes, config }) {
    const router = express.Router();
    const apiRoute = express.Router();

    apiRoute.use(body_parser.json()).use(cors()).use(helmet()).use(compression()).use(body_parser.urlencoded({extended: true}));
    apiRoute.use(cookieSession({
        name: 'registro_equipos',
        secret: config.COOKIE_SECRET,
        httpOnly: true
    }))

    apiRoute.use('/BD', BDRoutes);
    // apiRoute.use('/BD', AuthMiddleware, BDRoutes);
    apiRoute.use('/Auth', AuthRoutes);

    apiRoute.use('/pdf', PDFRoutes);


    router.use("/v1/api", apiRoute);

    return router;
} 