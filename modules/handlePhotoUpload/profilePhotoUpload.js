const sharp = require('sharp');
const { readFileSync, unlink } = require('fs');

module.exports.profilePhotoUpload = async function (req, res, next) {
    const photo = req?.file;
    console.log("🚀 ~ file: profilePhotoUpload.ts:5 ~ profilePhotoUpload ~ photo:", photo);

    let contentType = 'image/jpeg';
    let extension = 'jpg';

    if (photo?.mimetype === 'image/gif') {
        contentType = 'image/gif';
        extension = 'gif';
    }

    sharp(`./uploads/${photo?.filename}`)
        .jpeg({ quality: 90 })
        .resize(600, 600)
        .toFile(`./uploads/${photo?.filename.split(".")[0]}-sm.${extension}`, async (err, info) => {
        if (!info) {
            return;
        }

        const filetoUpload = readFileSync(`./uploads/${photo?.filename.split(".")[0]}-sm.${extension}`);
    });
};