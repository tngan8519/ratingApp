var multer = require("multer");
var path = require("path");
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/uploads/");
  },
  filename: function (req, file, callback) {
    callback(
      null,
      file.originalname.split(".").slice(0, 1) +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});
var imageFilter = function (req, file, callback) {
  var dotExternal = path.extname(file.originalname).toLowerCase();
  var mimetype = file.mimetype;
  var filetypes = /jpeg|jpg|png|gif/;
  if (filetypes.test(dotExternal) && filetypes.test(mimetype)) {
    callback(null, true);
  } else {
    callback("Error: Upload image only");
  }
};
var upload = multer({
  storage: storage,
  fileFilter: imageFilter,
});

module.exports = upload;
