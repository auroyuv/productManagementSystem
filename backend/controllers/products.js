const express = require('express')
const Router = express.Router()
const productModel = require('../schema/productSchema')
const multer = require('multer')
const path = require('path')


// Get product List
Router.get('/getProductList', async (req, res) => {
  try {
    const currentAdminId = req.user.adminId;

    const products = await productModel.find({ admin: currentAdminId });;
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get product Details
Router.get('/getProductDetails', async (req, res) => {
  try {
    const currentAdminId = req.user.adminId;
    const products = await productModel.find({ admin: currentAdminId });
    const productCount = await productModel.countDocuments({ admin: currentAdminId });
    const categoryCounts = {};
    products.forEach(product => {
      const category = product.category;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    res.json({
      count: productCount,
      category: categoryCounts,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Storage for products image files 
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, './uploads/products')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  }
})

const upload = multer({ storage: storage })


// Upload image to uploads folder
Router.post('/uploadImage/:id', async (req, res, next) => {
  const id = req.params.id;
  upload.single('image')(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(400).json({ error: 'File upload error', details: err.message });
    }

    if (!req.file) {
      return res.status(200).send("No file");
    }

    const image = req.file.filename;
    try {
      const product = await productModel.findByIdAndUpdate(id, { image: image });
      console.log("-------Added_Product------", product, "Added Image", image)
      res.status(200).send("File uploaded successfully");
    } catch (error) {
      console.error('Database update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});


// Add a product to the mongoDB
Router.post('/addProduct', async (req, res) => {
  try {
    const currentAdmin = req.user;

    const newProduct = new productModel({
      name: req.body.productName,
      description: req.body.productDescription,
      price: req.body.priceWithSymbol,
      maxQuantity: req.body.productQuantity,
      category: req.body.productCategory,
      weight: req.body.weight,
      admin: currentAdmin.adminId,
      reviews: [{}],  
    });

    const product = await newProduct.save();

    if (product) {
      res.status(200).json({ message: "Product added successfully", productId: product._id._id });
    } else {
      res.status(404).send("Internal server error")
    }
  } catch (error) {

    console.log("Internal server error", error.message);
    res.status(500).send("Internal server error")
  }
});


// Modify the product details
Router.put('/modifyProduct/:id', async (req, res) => {

  const productId = req.params.id
  const name = req.body.productName
  const description = req.body.productDescription
  const price = req.body.priceWithSymbol
  const maxQuantity = req.body.productQuantity
  const category = req.body.productCategory
  const weight = req.body.weight

  try {
    const product = await productModel.findOneAndUpdate(
      { _id: productId },
      {
        $set: {
          name,
          description,
          price,
          maxQuantity,
          category,
          weight,
        },
      },
      { new: true }
    );

    if (product) {
      res.status(200).send("Product updated successfully")
    } else {
      res.status(404).send("Internal server error")
    }
  } catch (error) {

    console.log("Internal server error", error)
    res.status(500).send("Internal server error")
  }
});


// Delete product by product ID
Router.delete("/deleteProduct/:id", async (req, res) => {

  const id = req.params.id

  try {
    const product = await productModel.findByIdAndDelete({ _id: id })
    if (!product) {
      return res.status(200).send("product not found")
    } else {
      console.log("Deleted Product", product)
      res.status(200).send("Product Deleted successfully")
    }
  } catch (error) {
    console.log('Error in deleting the product', error)
    res.status(500).send('Server Error')
  }
})


// Get product by product ID
Router.get('/getProduct/:productId', async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await productModel.findOne({ _id: productId });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = Router
