import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';
import { getCache, setCache, deleteCache } from '../utils/cache.js';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const validCategories = ['Dogs', 'Cats', 'Birds'];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'uploads', 'products');
const CLOUDINARY_UPLOAD_TIMEOUT = 20000;

const ensureCloudinaryConfigured = () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary is not configured. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
  }
};

const uploadImageFileToCloudinary = async (file) => {
  ensureCloudinaryConfigured();

  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  const result = await withTimeout(
    cloudinary.uploader.upload(dataUri, {
      folder: 'petnest',
      resource_type: 'image',
    }),
    CLOUDINARY_UPLOAD_TIMEOUT
  );

  return {
    image: result.secure_url,
    imagePublicId: result.public_id,
  };
};

const uploadImageUrlToCloudinary = async (imageUrl) => {
  ensureCloudinaryConfigured();

  const result = await withTimeout(
    cloudinary.uploader.upload(imageUrl, {
      folder: 'petnest',
      resource_type: 'image',
    }),
    CLOUDINARY_UPLOAD_TIMEOUT
  );

  return {
    image: result.secure_url,
    imagePublicId: result.public_id,
  };
};

const withTimeout = (promise, timeoutMs) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Cloudinary upload timed out')), timeoutMs);
    }),
  ]);
};

const getFileExtension = (file) => {
  const originalExt = path.extname(file.originalname || '').toLowerCase();
  if (originalExt) return originalExt;

  const mimeExt = file.mimetype?.split('/')[1];
  return mimeExt ? `.${mimeExt}` : '.jpg';
};

const saveImageFileLocally = async (file, req) => {
  await fs.mkdir(uploadDir, { recursive: true });

  const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${getFileExtension(file)}`;
  const targetPath = path.join(uploadDir, filename);
  await fs.writeFile(targetPath, file.buffer);

  return {
    image: `${req.protocol}://${req.get('host')}/uploads/products/${filename}`,
    imagePublicId: '',
  };
};

const deleteLocalImage = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('/uploads/products/')) return;

  try {
    const filename = decodeURIComponent(imageUrl.split('/uploads/products/')[1]);
    const targetPath = path.resolve(uploadDir, filename);

    if (!targetPath.startsWith(path.resolve(uploadDir))) return;
    await fs.unlink(targetPath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Failed to delete local product image:', error.message);
    }
  }
};

const resolveProductImage = async ({ file, imageUrl, req, existingImage }) => {
  if (file) {
    try {
      return await uploadImageFileToCloudinary(file);
    } catch (error) {
      console.error('Cloudinary file upload failed, saving locally instead:', error.message);
      return saveImageFileLocally(file, req);
    }
  }

  if (imageUrl?.trim() && imageUrl.trim() !== existingImage) {
    try {
      return await uploadImageUrlToCloudinary(imageUrl.trim());
    } catch (error) {
      console.error('Cloudinary URL upload failed, keeping image URL instead:', error.message);
      return {
        image: imageUrl.trim(),
        imagePublicId: '',
      };
    }
  }

  return {
    image: existingImage || imageUrl?.trim(),
    imagePublicId: '',
  };
};

const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return;

  try {
    ensureCloudinaryConfigured();
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Failed to delete Cloudinary image:', error.message);
  }
};

const validateProductInput = ({ name, price, description, category, stock, image }) => {
  const productPrice = Number(price);
  const productStock = Number(stock);

  if (!name?.trim()) return 'Product name is required';
  if (!description?.trim()) return 'Product description is required';
  if (!category || !validCategories.includes(category)) return 'Valid category is required';
  if (price === undefined || !Number.isFinite(productPrice) || productPrice < 0) return 'Product price must be 0 or higher';
  if (stock === undefined || !Number.isFinite(productStock) || productStock < 0) return 'Product stock must be 0 or higher';
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

    const cacheKey = req.query.keyword
      ? `products:all:${req.query.keyword.toLowerCase()}`
      : 'products:all';

    // 1. Check Redis
    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    // 2. Cache miss → hit MongoDB
    const products = await Product.find({ ...keyword }).sort({ createdAt: -1 });

    // 3. Store in Redis for next time
    await setCache(cacheKey, products);

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
    const cacheKey = `product:${req.params.id}`;

    // 1. Check Redis
    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    // 2. Cache miss → hit MongoDB
    const product = await Product.findById(req.params.id);

    if (product) {
      // 3. Store in Redis
      await setCache(cacheKey, product);
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
    const providedImage = req.file ? 'uploaded-image' : req.body.image;
    const validationError = validateProductInput({ name, price, description, category, stock, image: providedImage });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const uploadedImage = await resolveProductImage({
      file: req.file,
      imageUrl: req.body.image,
      req,
    });

    const product = new Product({
      name: name.trim(),
      price: Number(price),
      description: description.trim(),
      category,
      stock: Number(stock),
      image: uploadedImage.image,
      imagePublicId: uploadedImage.imagePublicId,
    });

    const createdProduct = await product.save();
    await deleteCache('products:all');
    res.status(201).json(createdProduct);
  } catch (error) {
    
    console.error('================================');
    console.error('PRODUCT CREATION ERROR');
    console.error(error);
    console.error('================================');

    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      let image = req.body.image ?? product.image;
      let imagePublicId = product.imagePublicId || '';

      if (req.file) {
        const uploadedImage = await resolveProductImage({
          file: req.file,
          req,
        });
        await deleteCloudinaryImage(product.imagePublicId);
        await deleteLocalImage(product.image);
        image = uploadedImage.image;
        imagePublicId = uploadedImage.imagePublicId;
      } else if (req.body.image && req.body.image !== product.image) {
        const uploadedImage = await resolveProductImage({
          imageUrl: req.body.image,
          req,
          existingImage: product.image,
        });
        await deleteCloudinaryImage(product.imagePublicId);
        await deleteLocalImage(product.image);
        image = uploadedImage.image;
        imagePublicId = uploadedImage.imagePublicId;
      }

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
      product.imagePublicId = imagePublicId;

      const updatedProduct = await product.save();
      await deleteCache(['products:all', `product:${req.params.id}`]);
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {

    console.error('================================');
    console.error('PRODUCT UPDATE ERROR');
    console.error(error);
    console.error('================================');

    res.status(500).json({
      message: error.message,
    });
    
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await deleteCloudinaryImage(product.imagePublicId);
      await deleteLocalImage(product.image);
      await product.deleteOne();
      await deleteCache(['products:all', `product:${req.params.id}`]);
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
