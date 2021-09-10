module.exports = (err, req, res, next) => {
    const httpStatus = err.status || 500;
    return res.send({
        status: httpStatus,
        message: err.message || 'Internal Server Error'
    });
};