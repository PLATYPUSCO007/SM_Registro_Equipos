module.exports = {
    NotFoundMiddleware: require('./Not-found.middleware'),
    ErrorMiddleware: require('./error.middleware'),
    AuthMiddleware: require('./auth.middleware'),
    FileMiddleware: require('./UploadFiles.middleware'),
    DataValidateMiddleware: require('./DataValidation.middleware'),
}