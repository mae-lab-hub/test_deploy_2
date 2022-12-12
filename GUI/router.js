const stream = require("stream");
const express = require("express");
const multer = require("multer");
const path = require("path");
const { google } = require("googleapis");
 
const uploadRouter = express.Router();
const upload = multer();
var id
 
const KEYFILEPATH = path.join(__dirname, "credentials.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];
 
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});


uploadRouter.post("/upload", upload.any(), async (req, res) => {
    try {
      console.log(req.body);
      console.log(req.files);
      const { body, files } = req;
      var r 
   
      for (let f = 0; f < files.length; f += 1) {
        await uploadFile(files[f]);
      }
      console.log(id);
      return res.status(200).json({
        data: id, 
      });
    } catch (f) {
      console.log(f.message);
      res.send(f.message);
    }
  });

  const uploadFile = async (fileObject) => {
    const bufferStream = new stream.PassThrough();
    var r
    bufferStream.end(fileObject.buffer);
    const { data } = await google.drive({ version: "v3", auth }).files.create({
      media: {
        mimeType: fileObject.mimeType,
        body: bufferStream,
      },
      requestBody: {
        name: fileObject.originalname,
        parents: ["10xvKIyxWKXk_1CuGvg4J8nfU8KXCPDBH"],
      },
      fields: "id,name",
    });
    console.log(`Uploaded file ${data} ${data.id}`);
    id = data.id;
  };
   
  module.exports = uploadRouter;