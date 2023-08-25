require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pahlhyl.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("repliq");
    const productCollection = db.collection("products");
    const userCollection = db.collection("users");



    // Product Collections

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.post("/product", async (req, res) => {
      const product = req.body;
    
      try {
        const result = await productCollection.insertOne(product);
        if (result.insertedCount === 1) {
          res.status(201).json({ message: "Product inserted successfully.", insertedId: result.insertedId });
        } else {
          res.status(500).json({ message: "Product insertion failed." });
        }
      } catch (error) {
        console.error("Error inserting product:", error);
        res.status(500).json({ message: "An error occurred while inserting the product." });
      }
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.deleteOne({
        _id: new ObjectId(id),
      });
      console.log(result);
      res.send(result);
    });

    app.put("/products/:id", async (req, res) => {
      const productId = req.params.id;
      const updatedProduct = req.body;
    
      try {
        const result = await productCollection.updateOne(
          { _id: new ObjectId(productId) },
          { $set: updatedProduct }
        );
    
        if (result.modifiedCount === 1) {
          res.status(200).json({ message: "Product updated successfully." });
        } else {
          res.status(500).json({ message: "Product update failed." });
        }
      } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "An error occurred " });
      }
    });
    

    // User Collections
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find({});
      const user = await cursor.toArray();

      res.send({ status: true, data: user });
    });

    app.post("/user", async (req, res) => {
      const user = req.body;
    
      try {
        const result = await userCollection.insertOne(user);
        if (result.insertedCount === 1) {
          res.status(201).json({ message: "User inserted successfully.", insertedId: result.insertedId });
        } else {
          res.status(500).json({ message: "User insertion failed." });
        }
      } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).json({ message: "An error occurred while inserting." });
      }
    });

    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const result = await userCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;

      const result = await userCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.put("/user/:id", async (req, res) => {
      const userId = req.params.id;
      const updatedUser = req.body;
    
      try {
        const result = await userCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $set: updatedUser }
        );
    
        if (result.modifiedCount === 1) {
          res.status(200).json({ message: "Ueer updated successfully." });
        } else {
          res.status(500).json({ message: "User update failed." });
        }
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "An error occurred " });
      }
    });
    

  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Repliq Server");
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
