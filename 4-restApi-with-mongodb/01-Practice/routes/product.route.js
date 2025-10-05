const express = require("express");
const router = express.Router();

const {
  getProducts,
  getSingleProduct,
  newProduct,
  updatedProduct,
  deleteProduct,
} = require("../controllers/product.controller.js");

router.get("/", getProducts);

router.get("/:id", getSingleProduct);

router.post("/", newProduct);

router.put("/:id", updatedProduct);

router.delete("/:id", deleteProduct);

module.exports = router;
