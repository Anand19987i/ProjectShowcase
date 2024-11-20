import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({ storage }).fields([
    { name: "frontendFile", maxCount: 1 },
    { name: "backendFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 2 },
  ]);