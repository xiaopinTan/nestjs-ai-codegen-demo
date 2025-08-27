import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  apiKey: process.env.DEESEEK_API_KEY,
  baseUrl: process.env.DEESEEK_BASE_URL,
  modelName: process.env.MODEL_NAME,
};
