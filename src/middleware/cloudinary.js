require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dw5curx0g",
  api_key: "622515422623414",
  api_secret: "DyJUWbUzFAtOxynv_rUtH52LmNg",
});

const helper = (files, req, next) => {
  let cloudinaryUrl = [];
  let count = 0;
  let fileLength = files?.length;
  if (fileLength > 0) {
    for (let i = 0; i < files?.length; i++) {
      cloudinary.uploader
        .upload(files[i].path, {
          resource_type: "auto",
        })
        .then((result) => {
          if (result) {
            count += 1;
            cloudinaryUrl.unshift(result.url);
            req.cloudinaryPath = cloudinaryUrl;
            if (count === fileLength) {
              return next();
            }
          }
        });
    }
  } else {
    next();
  }
};
module.exports = {
  helper,
};
