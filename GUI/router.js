const stream = require("stream");
const express = require("express");
const multer = require("multer");
const path = require("path");
const { google } = require("googleapis");
 
const uploadRouter = express.Router();
const upload = multer();
 
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
   
      for (let f = 0; f < files.length; f += 1) {
        await uploadFile(files[f]);
      }
   
      console.log(body);
      res.status(200).send("Form Submitted");
    } catch (f) {
      res.send(f.message);
    }
  });

  const uploadFile = async (fileObject) => {
    const bufferStream = new stream.PassThrough();
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
    const id = data.id;
    const Url = `https://adb6-74-12-78-193.ngrok.io/predict/${data.id}`
    fetch(Url)
    .then(data=>{return data.json()})
    .then(res=>{
        console.log(res)
    })
  };
   
  module.exports = uploadRouter;