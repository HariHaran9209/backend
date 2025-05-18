import Food from '../models/Food.model.js'
import fs from 'fs'
import path from 'path'

const addFood = async (req, res) => {
    try {
        console.log('Request Received: ', {
            hasFile: !!req.file,
            body: req.body,
            headers: req.headers
        })
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No File Uploaded',
                details: {
                    body: req.body,
                    headers: req.headers
                }
            })
        }

        console.log('File Received: ', {
            filename: req.file.filename,
            path: req.file.path,
            mimetype: req.file.mimetype
        })

        const food = new Food({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: req.file.filename,
            category: req.body.category
        })

        await food.save()
        res.json({
            success: true,
            message: 'Food added Successfully',
            data: food
        })
    } catch (error) {
        console.log('Error in addFood: ', error)
        res.status(500).json({ success: false, message: error.message, details: error.stack })
    }
}


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
        const food = await Food.findById(req.body.id)
        fs.unlink(`uploads/${food.image}`, () => {})

        await Food.findByIdAndDelete(req.body.id)
        res.json({
            success: true,
            message: "Food removed successfully",
            data: food
        });
    } catch (error) {
        console.error('Error in removeFood:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            details: error.stack
        });
    }
}

export { addFood, listFood, removeFood }