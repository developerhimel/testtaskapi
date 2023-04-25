const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

var jsonParser = bodyParser.json();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json({ type: "application/*+json" }));

const port = 8383;
const uri =
  "mongodb+srv://testtask:testtask123@dsworldcluster.bsgtxoq.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);
const db = client.db("testdb");

async function main() {
  await client
    .connect(uri)
    .then(console.log("Database Connected"))
    .catch((error) => console.log(console.error(error)));
}

main()
  .then(() => {
    app.get("/", (req, res) => {
      res.status(200).send("server running");
    });

    app.get("/getSelectors", async (req, res) => {
      const collection = db.collection("selectors");
      const selectors = await collection.find().toArray();
      res.status(200).send(selectors[0].selectors);
    });

    app.post("/newUser", jsonParser, async (req, res) => {
      const { userName, sectors } = req.body;
      const collection = db.collection("users");
      await collection
        .insertOne({ userName: userName, sectors: sectors })
        .then((data) => res.status(200).send(data.insertedId))
        .catch((error) => console.error(error));
    });

    app.post("/updateUser", jsonParser, async (req, res) => {
      const { id, userName, sectors } = req.body;
      const collection = db.collection("users");
      await collection
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { userName: userName, sectors: sectors } }
        )
        .then(() => res.status(200).send(id))
        .catch((error) => console.error(error));
    });

    app.post("/getUser", jsonParser, async (req, res) => {
      const { id } = req.body;
      const collection = db.collection("users");
      await collection
        .findOne({ _id: new ObjectId(id) })
        .then((data) => res.status(200).send(data))
        .catch((error) => console.error(error));
    });

    app.listen(port, () => console.log(`Server has started on port: ${port}`));
  })
  .catch((error) => console.error(error));
