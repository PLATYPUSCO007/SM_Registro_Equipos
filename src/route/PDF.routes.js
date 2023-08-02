const { Router } = require('express');
const {DataValidateMiddleware} = require('../middleware');

module.exports = function ({ PDFController }) {
    const router = Router();

    router.get('/:anio', PDFController.generatePDFMantenimiento);

    return router;
};