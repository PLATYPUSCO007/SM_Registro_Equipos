const multer = require('multer');
const path = require('path');

const diskStorage = multer.diskStorage({
    destination: path.join(__dirname, '../files'),
    filename: (req, file, cb)=>{
        cb(null, Date.now() + '-' + file.originalname)
    }
});

module.exports = multer({
    storage: diskStorage
}).array('files', 10);