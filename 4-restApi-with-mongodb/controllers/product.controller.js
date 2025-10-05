const Product = require("../modals/product.model.js");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    // extract id from url
    const { id } = req.params;
    // find the specific product
    const product = await Product.findById(id);

    // return the product
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
};

const newProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(200).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
};

const updatedProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true, // return the updated document
      runValidators: true, // ✅ this ensures schema validation runs
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found !",
      });
    }

    // re-checking from db
    const updatedProduct = await Product.findById(id);

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(400).json({
        message: "Product not found !",
      });
    }

    res.status(200).json({
      message: "product deleted successfully !",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  getProducts,
  getSingleProduct,
  newProduct,
  updatedProduct,
  deleteProduct,
};
