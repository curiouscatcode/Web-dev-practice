// Getting files
const express = require("express");
const mongoose = require("mongoose");
/** @type {import('mongoose').Model} */
const Product = require("./modals/product.model.js"); // models
const productRoute = require("./routes/product.route.js");

// initiallisation
const app = express();
const PORT = process.env.PORT;
app.use(express.json()); // middleware
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/api/products", productRoute);

// 1.Home
app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

// 2. Getting all the products
// app.get("/api/products", async (req, res) => {
// try {
//   const products = await Product.find({});
//   res.status(200).json(products);
// } catch (err) {
//   console.error(err);
//   res.status(500).json({
//     message: err.message,
//   });
// }
// });

// 3. Getting one particular product
// app.get("/api/products/:id", async (req, res) => {
//   // try {
//   //   // extract id from url
//   //   const { id } = req.params;
//   //   // find the specific product
//   //   const product = await Product.findById(id);
//   //   // return the product
//   //   res.status(200).json(product);
//   // } catch (err) {
//   //   console.error(err);
//   //   res.status(500).json({
//   //     error: err.message,
//   //   });
//   // }
// });

// 4. Inserting products
// app.post("/api/products", async (req, res) => {
//   try {
//     const newProduct = await Product.create(req.body);
//     res.status(200).json(newProduct);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       error: err.message,
//     });
//   }
// });

// 5. update the product
// app.put("/api/products/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const product = await Product.findByIdAndUpdate(id, req.body, {
//       new: true, // return the updated document
//       runValidators: true, // ✅ this ensures schema validation runs
//     });

//     if (!product) {
//       return res.status(404).json({
//         message: "Product not found !",
//       });
//     }

//     // re-checking from db
//     const updatedProduct = await Product.findById(id);

//     res.status(200).json(updatedProduct);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       error: err.message,
//     });
//   }
// });

// 6. Delete product
// app.delete("/api/products/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const product = await Product.findByIdAndDelete(id);

//     if (!product) {
//       return res.status(400).json({
//         message: "Product not found !",
//       });
//     }

//     res.status(200).json({
//       message: "product deleted successfully !",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       error: err.message,
//     });
//   }
// });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to the db !");
    app.listen(3000, () => {
      console.log(`Listening to the server on ${PORT}`);
    });
  })
  .catch(() => {
    console.log("Connection failed !");
  });
