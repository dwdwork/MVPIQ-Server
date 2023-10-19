const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const multerS3 = require("multer-s3");

const createUploadFolder = (folderName) => {
    try {
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }
    } catch (err) {
        console.error(err);
    }
};
createUploadFolder("./uploads/");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, uuid().replace(/-/g, "") + path.extname(file.originalname));
    },
});

const fileFilter = function (req, file, cb) {
    console.log(file);

    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type."));
    }
};

const fileFilterVideo = function (req, file, cb) {
    console.log(file);

    if (file.mimetype === "video/mp4") {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type, only MP4 is supported"));
    }
};

const fileFilterAudio = function (req, file, cb) {
    console.log(file);

    if (file.mimetype.startsWith("audio/")) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type, only audio is supported"));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 16000000 },
    fileFilter,
});

const uploadVideo = multer({
    storage: storage,
    limits: { fileSize: 16000000 },
    fileFilter: fileFilterVideo,
});

const uploadAudio = multer({
    storage: storage,
    limits: { fileSize: 16000000 },
    fileFilter: fileFilterAudio,
});

module.exports = {
    upload,
    uploadVideo,
    uploadAudio,
};
