const { handleErrorResponse } = require("./handle.error.middleware");
const { validateExtensionsToFile } = require("../utils/upload.file.utils");

const validateFileOptional =
  (nameFile, allowedExtensions) => (req, res, next) => {
    if (
      !req.files ||
      Object.keys(req.files).length === 0 ||
      !req.files[nameFile]
    ) {
      next();
      return;
    }
    uploadMultipleOrSingleFile(nameFile, allowedExtensions)(req, res, next);
  };

const uploadFile = (nameFile, allowedExtensions) => (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files[nameFile])
    return handleErrorResponse(res, "Suba el archivo solicitado", 400);

  if (!validateExtensionsToFile(allowedExtensions, req.files[nameFile])) {
    return handleErrorResponse(
      res,
      "La extensión del archivo no es válida",
      400
    );
  }
  next();
};

const uploadMultipleOrSingleFile =
  (nameFile, allowedExtensions) => (req, res, next) => {
    if (
      !req.files ||
      Object.keys(req.files).length === 0 ||
      !req.files[nameFile]
    )
      return handleErrorResponse(res, "Suba el archivo solicitado", 400);

    if (!Array.isArray(req.files[nameFile])) {
      if (!validateExtensionsToFile(allowedExtensions, req.files[nameFile])) {
        return handleErrorResponse(
          res,
          "La extensión del archivo no es válida",
          400
        );
      }
    } else {
      for (const file of req.files[nameFile]) {
        if (!validateExtensionsToFile(allowedExtensions, file)) {
          return handleErrorResponse(
            res,
            "La extensión del archivo no es válida",
            400
          );
        }
      }
    }
    next();
  };
module.exports = {
  validateFileOptional,
  uploadFile,
  uploadMultipleOrSingleFile,
};
