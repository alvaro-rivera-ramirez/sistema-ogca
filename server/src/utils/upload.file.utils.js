const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");


/**
 * 
 * @param {file} file 
 * @param {string} nameMainFolder public or private 
 * @param {string} namefolder 
 * @param {string} extensions 
 * @returns 
 */

const uploadFile = (file,nameMainFolder="public", namefolder, extensions = ["jpg", "jpeg", "png"]) => {
  return new Promise((resolve, reject) => {
    //Valid Extensions
    const fileExt = file.name.split(".").pop();
    if (!validateExtensionsToFile(extensions,file)) {
      return reject({
        ok: false,
        message: `La extensión del archivo no es válida`,
        code: 400,
        file: `${namefolder}`,
      });
    }


    const nameUniqueFile = uuidv4() + "." + fileExt;

    const uploadPath = path.join(
      __dirname,
      `../../uploads/${nameMainFolder}/${namefolder}`,
      nameUniqueFile
    );

    file.mv(uploadPath, (err) => {
      if (err) {
        return reject({
          ok: false,
          message: "Error al guardar el archivo!",
          code: 500,
        });
      }
      resolve({ ok: true, dirFile: `${namefolder}/${nameUniqueFile}`,nameFile:file.name });
    });
  });
};

const validateExtensionsToFile = (extensions, file) => {
  const allowedExtensions = extensions;
  const fileExt = file.name.split(".").pop();
  return (allowedExtensions.includes(fileExt));
};

const deleteFile = async (namefolder="public",filePath) => {
  const PATH_FILE = path.join(__dirname, `../../uploads/${namefolder}/`, filePath);
  return fs.unlinkSync(PATH_FILE);
};
module.exports = {
  uploadFile,
  deleteFile,
  validateExtensionsToFile
};