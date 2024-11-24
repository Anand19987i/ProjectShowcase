import DataUriParser from "datauri/parser.js";
import path from "path";

const getDataUri = (file) => {
  if (!file || !file.buffer) {
    throw new Error("Invalid file object or missing buffer");
  }

  const parser = new DataUriParser();
  const extName = path.extname(file.originalname).toString();
  const formattedData = parser.format(extName, file.buffer);
  if (!formattedData || !formattedData.content) {
    throw new Error("Failed to convert file to Data URI");
  }


  return formattedData.content;
};

export default getDataUri;
