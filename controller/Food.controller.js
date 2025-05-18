import Food from '../models/Food.model.js'
import fs from 'fs'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary';

const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No File Uploaded' });
    }

    const food = new Food({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: req.file.path,   // <-- Use full Cloudinary URL here
      category: req.body.category,
    });

    await food.save();

    res.json({
      success: true,
      message: 'Food added Successfully',
      data: food,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const listFood = async (req, res) => {
    try {
        const foods = await Food.find({});
        res.json({
            success: true,
            message: "Foods fetched successfully",
            data: foods
        });
    } catch (error) {
        console.error('Error in listFood:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            details: error.stack
        });
    }
}

const removeFood = async (req, res) => {
  try {
    const food = await Food.findById(req.body.id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }

    // Extract public_id from the Cloudinary URL to delete the image
    // Example Cloudinary URL:
    // https://res.cloudinary.com/<cloud_name>/image/upload/v1234567890/folder/filename.jpg
    // We need "folder/filename" (without extension)

    const urlParts = food.image.split('/');
    const publicIdWithExt = urlParts.slice(-2).join('/'); // e.g. folder/filename.jpg
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ""); // remove extension

    await cloudinary.uploader.destroy(publicId);

    await Food.findByIdAndDelete(req.body.id);

    res.json({
      success: true,
      message: 'Food removed successfully',
      data: food,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export { addFood, listFood, removeFood }
