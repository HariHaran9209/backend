import express from 'express'
import { addFood, listFood, removeFood } from '../controller/Food.controller.js'
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv'

dotenv.config()

const foodRouter = express.Router()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'your-folder-name', // optional folder in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

foodRouter.post('/add', upload.single('image'), addFood)
foodRouter.get('/list', listFood)
foodRouter.post('/remove', removeFood)

export default foodRouter
