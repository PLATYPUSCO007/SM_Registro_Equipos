const { Router } = require('express');

module.exports = function ({ PerifericoRoutes }) {
    const router = Router();

    router.use('/periferico', PerifericoRoutes);
    router.get('/', function(req, res){
        res.status(200).send('BD LOAD...')
    });

    return router;
};