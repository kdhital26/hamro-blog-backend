const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/uploads/') // specify the destination folder for the file
    },
    filename: function (req, file, cb) {
      // let extension = path.extname(file.originalname) // only extension of image
      cb(null, Date.now() + '-' + file.originalname) // generate a unique filename for the file
    }
  });
  
  const upload = multer({
    storage: storage,
  });

  module.exports = upload;