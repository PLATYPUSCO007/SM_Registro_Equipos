const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const body_parser = require('body-parser');
const session = require('express-session');

const {AuthMiddleware} = require('../middleware');

require('express-async-errors');

module.exports = function ({ BDRoutes, AuthRoutes, PDFRoutes, config }) {
    const router = express.Router();
    const apiRoute = express.Router();

    apiRoute.use(cors({
        origin: ["http://localhost:4200"],
        credentials: true,
    })).use(body_parser.json()).use(helmet()).use(compression()).use(body_parser.urlencoded({extended: true}));
    
    apiRoute.use(session({
        name: 'control_equipos',
        secret: config.COOKIE_SECRET,
        resave: false,
        saveUninitialized: true,
        // path: '/',
        cookie: {
            httpOnly: false,
        },
    }))

    apiRoute.use('/BD', AuthMiddleware.verifyToken, BDRoutes);
    // apiRoute.use('/BD', AuthMiddleware, BDRoutes);
    apiRoute.use('/Auth', AuthRoutes);

    apiRoute.use('/pdf', AuthMiddleware.verifyToken, PDFRoutes);


    router.use("/v1/api", apiRoute);

    return router;
} 