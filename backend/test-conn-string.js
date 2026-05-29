import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

dotenv.config();

cloudinary.config({
  cloudinary_api_url: 'cloudinary://437286798746189:NpM8aY9awb9kt1U4e3LwGKHBhP0@dbjlrhr6t'
});

const dummyPngBuffer = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);
fs.writeFileSync('temp-dummy.png', dummyPngBuffer);

try {
  const result = await cloudinary.uploader.upload('temp-dummy.png');
  console.log('Upload success! URL:', result.secure_url);
} catch (error) {
  console.error('Upload failed:', error);
} finally {
  if (fs.existsSync('temp-dummy.png')) {
    fs.unlinkSync('temp-dummy.png');
  }
}
