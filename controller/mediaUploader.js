const cloudinary = require("../database/cloudinary");
const sharp = require("sharp");

module.exports.uploadMedia = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    sharp(fileBuffer)
      .metadata()
      .then((metadata) => {
        const { width, height } = metadata;
        sharp(fileBuffer)
          .resize(width, height) 
          .toBuffer() 
          .then((resizedBuffer) => {
            cloudinary.uploader.upload_stream(
              { resource_type: "image" },
              async (error, result) => {
                if (error) {
                  console.error(error);
                  reject("Failed to upload image to Cloudinary");
                } else {
                  const imageUrl = result.secure_url;
                  const imageUrlWithParams = `${imageUrl}?w=${width}&h=${height}&c=fill`;
                  resolve(imageUrlWithParams);
                }
              }
            ).end(resizedBuffer);
          })
          .catch((resizeErr) => {
            console.error(resizeErr);
            reject("Failed to resize image");
          });
      })
      .catch((err) => {
        console.error(err);
        reject("Failed to process image dimensions");
      });
  });
};
