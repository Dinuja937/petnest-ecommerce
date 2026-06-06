import dotenv from 'dotenv';
import crypto from 'crypto';
import axios from 'axios';

dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('Using Cloud Name:', cloudName);
console.log('Using API Key:', apiKey);

// Generate signature
const timestamp = Math.round(new Date().getTime() / 1000);
const folder = 'test_connection';

// Parameters to sign must be sorted alphabetically
const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
const signature = crypto
  .createHash('sha1')
  .update(paramsToSign + apiSecret)
  .digest('hex');

const sampleImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

try {
  const response = await axios.post(url, {
    file: sampleImage,
    api_key: apiKey,
    timestamp: timestamp,
    signature: signature,
    folder: folder,
  });
  console.log('SUCCESS:', response.data);
} catch (error) {
  console.error('FAILED TO UPLOAD. HTTP Status:', error.response?.status);
  console.error('Response Data:', JSON.stringify(error.response?.data, null, 2));
}
