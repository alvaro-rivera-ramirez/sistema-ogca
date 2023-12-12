const multer = require('multer');
const path = require('path')
const {v4: uuid}=require("uuid")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,'../../uploads/private/file-survey',));
  },
  filename: function (req, file, cb) {
    // Define el nombre del archivo en el sistema de archivos
    cb(null, file.fieldname + '-' + Date.now());
  }
});

const upload = multer({ storage: storage });