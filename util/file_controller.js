const fs = require('fs');
const path = require('path');
const rootDir = path.dirname(process.mainModule.filename);
const multer = require('multer');

exports.deleteFile = (filePath) => {
  fs.unlink(path.join(rootDir, filePath), (err) => {
    if (err) throw err;
  });
};

exports.fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'data/product_images');
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + '_' + file.originalname);
  }
});

exports.fileFilter = (req, file, callback) => {
  if (file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg') {
    callback(null, true);
  } else {
    callback(null, false)
  };
};