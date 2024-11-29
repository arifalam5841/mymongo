const fs = require("fs");
require("dotenv").config();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;
const path = require("path");
const express = require("express");
const app = express();
// const port = 3000;
const bodyparse = require("body-parser");
const mongoose = require("mongoose");
const { engine } = require("express-handlebars");
const hbs = require("handlebars");
const request = require("requests");
const { Console } = require("console");
const { pseudoRandomBytes } = require("crypto");

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DATABASE CONNECTED"))
  .catch((err) => console.log(err));

const productschema = {
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
};

const product = mongoose.model("Products", productschema);

const staticpath = path.join(__dirname, "./public");
const partialspath = path.join(__dirname, "./partials");

app.use(bodyparse.urlencoded({ extend: true }));
// app.use(bodyparse.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
  "hbs",
  engine({
    extname: "hbs",
    defaultLayout: false,
    layoutsDir: path.join(__dirname, "views"),
    partialsDir: partialspath,
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(staticpath));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/adding-product", (req, res) => {
  const { names, prices, qtys } = req.body;

  if (!names || !prices || !qtys) {
    return res.status(400).json({ status: false, message: "Invalid input" });
  }

  try {
    const newproduct = new product({
      name: names,
      price: prices,
      qty: qtys,
    });
    newproduct.save();
    console.log("Product added");
    res.json({ status: true, message: "Product added successfully..." });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ status: false, message: "Product could not be added" });
  }
});

// OPERATORS ---------------------------------

async function getproducts() {
  try {
    const result = await product.find({ price: { $gt: 5000, $lt: 50000 } });
    console.log("products price greater than 5000 : ");
    console.log(result);

    const result2 = await product.find({
      name: { $in: ["iphone", "samsung"] },
    });

    console.log("Items whose name are iphone and samsung");

    result2.forEach((element) => {
      console.log(element.name);
      console.log(element.price);
    });

    const result3 = await product.find({ name: { $nin: ["iphone"] } });

    console.log("Items whose name are not equal to iphone");
    console.log(result3);

    const result4 = await product.find({ qty: { $eq: 2 } });

    console.log("Items who quantity is equal to 2");
    console.log(result4);

    const result5 = await product.find({ price: { $gte: 1000 } });
    console.log("Items whose price are greater and equal to 1000");
    console.log(result4);
  } catch (err) {
    console.log(err);
  }
}

// getproducts();

async function logicaloperators() {
  try {
    const result = await product.find({
      $or: [{ name: "samsung" }, { price: { $gt: 50000 } }],
    });

    console.log("items whose price is greater than 50000 or name is samsung");
    console.log(result);

    const result2 = await product.find({
      $and: [{ name: "iphone" }, { qty: 1 }],
    });
    console.log("Items whose name is iphone and quantity is 1");
    console.log(result2);

    const result3 = await product.find({ name: { $not: { $in: ["iphone"] } } });
    console.log("Item whose name is not iphone");
    console.log(result3);

    const result4 = await product.find({
      $nor: [{ name: "iphone" }, { price: { $gt: 1000 } }],
    });
    console.log(
      "Items whose name is not iphone and price is not greater than 1000"
    );
    console.log(result4);
  } catch (err) {
    console.log(err);
  }
}

// logicaloperators();

async function sorting_count() {
  try {
    const result = await product
      .find({ price: { $gt: 10 } })
      // .select({ qty: 1 }) // select only the name field
      .sort({ qty: 1 }); // sort in ascending order or if the value is in string then sort in a-z order the value you put in the sort

    console.log(
      "Item whose price is greater than 10 with price in ascending order"
    );

    console.log(result);

    const result2 = await product
      .find({ name: { $not: { $in: ["oppo"] } } })
      .countDocuments(); // it will count the number of documents in the collection

    console.log(result2);
  } catch (err) {
    console.log(err);
  }
}

// sorting_count();

// every document has unique id

// async function updatingdb() {}

// async function updateDocument(_id, name) {
//   const result = await product.findByIdAndUpdate(
//     { _id }, // the documents which matches this argument will be changed
//     { $set: { name: "updated new data" } },
//     {
//       new: true, // it will return the updated document
//     }
//   );
//   console.log(result);

//   const result2 = await product.updateMany(
//     { name: name },
//     { $set: { price: 213 } },
//     {
//       new: true,
//     }
//   );

//   console.log(result2);

//   const result3 = await product.updateMany(
//     { name: { $not: { $in: ["samsung", "vivo"] } } },
//     { qty: 5 },
//     {
//       new: true,
//     }
//   );

//   console.log(result3);
// }
// updateDocument("674743e8bd1290621146ed45", "samsung");
//end{code}

app.listen(port, () => {
  console.log("Working");
});
