import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

try {
  await cloudinary.uploader.upload('uploads/products/1780745716522-f2dd3d60704e00d9.jpg');
} catch (error) {
  console.log('Error Type:', typeof error);
  console.log('Error Keys:', Object.keys(error));
  console.log('Error Name:', error.name);
  console.log('Error Message:', error.message);
  console.log('Error JSON:', JSON.stringify(error, null, 2));
}
