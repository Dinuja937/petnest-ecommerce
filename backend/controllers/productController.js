import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

const validCategories = ['Dogs', 'Cats', 'Birds'];

const uploadImageToCloudinary = (fileBuffer) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary is not configured. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'petnest',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

const validateProductInput = ({ name, price, description, category, stock, image }) => {
  if (!name?.trim()) return 'Product name is required';
  if (!description?.trim()) return 'Product description is required';
  if (!category || !validCategories.includes(category)) return 'Valid category is required';
  if (price === undefined || Number(price) < 0) return 'Product price must be 0 or higher';
  if (stock === undefined || Number(stock) < 0) return 'Product stock must be 0 or higher';
  if (!image?.trim()) return 'Product image is required';

  return null;
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};

    const products = await Product.find({ ...keyword });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock } = req.body;
    const image = req.file ? await uploadImageToCloudinary(req.file.buffer) : req.body.image;
    const validationError = validateProductInput({ name, price, description, category, stock, image });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const product = new Product({
      name: name.trim(),
      price: Number(price),
      description: description.trim(),
      category,
      stock: Number(stock),
      image: image.trim(),
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock } = req.body;
    const image = req.file ? await uploadImageToCloudinary(req.file.buffer) : req.body.image;

    const product = await Product.findById(req.params.id);

    if (product) {
      const nextProduct = {
        name: name ?? product.name,
        price: price ?? product.price,
        description: description ?? product.description,
        category: category ?? product.category,
        stock: stock ?? product.stock,
        image: image ?? product.image,
      };
      const validationError = validateProductInput(nextProduct);

      if (validationError) {
        return res.status(400).json({ message: validationError });
      }

      product.name = nextProduct.name.trim();
      product.price = Number(nextProduct.price);
      product.description = nextProduct.description.trim();
      product.category = nextProduct.category;
      product.stock = Number(nextProduct.stock);
      product.image = nextProduct.image.trim();

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
