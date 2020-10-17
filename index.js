const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const MongoClient = require("mongodb").MongoClient;

const app = express();
require("dotenv").config();

app.use(bodyParser.json());

app.use(cors());
app.use(express.static("service-img"));
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rxunt.mongodb.net/creative-agency?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  if (err) {
    return console.log(err);
  }
  const clientServiceCollection = client
    .db("creative-agency")
    .collection("client-service");

  app.post("/add-client-service", (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const email = req.body.email;
    const service = req.body.service;
    const description = req.body.description;
    const price = req.body.price;
    const newImg = file.data;
    const encImg = newImg.toString("base64");

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, "base64"),
    };

    clientServiceCollection
      .insertOne({ name, email, service, description, price, image })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
  });

  app.get("/get-client-service", (req, res) => {
    clientServiceCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  console.log("database connected successfully");
});

app.get("/", (req, res) => {
  res.send("hello from Creatice Agency");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, (req, res) => {
  console.log(`server is running in port ${PORT}`);
});
