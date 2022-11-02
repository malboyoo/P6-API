const multer = require("multer");

// le middleware multer récuperer l'information avec le type-application Form-data et permet notamment de récuperer des fichiers

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  // emplacement ou sera stocké l'image
  destination: (req, file, callback) => {
    callback(null, "public/images");
  },
  // création d'un nom personnalisé
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_").split(".")[0];
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});
// ici nous exportons notre middleware multer entièrement configuré et près à l'emploi
// "image" est également le nom du champ du formulaire sur lesquel le fichier est choisi
module.exports = multer({ storage }).single("image");
