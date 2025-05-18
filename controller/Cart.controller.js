import User from '../models/User.model.js'
import Food from '../models/Food.model.js'

const addToCart = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId

        let userData = await User.findById(userId)
        if (!userData) {
            return res.json({ success: false, message: 'User Not Found' })
        }

        let cartData = userData.cartData || {}

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1
        } else {
            cartData[req.body.itemId] += 1
        }

        await User.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: 'Added To Cart' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}


const removeFromCart = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId
        let userData = await User.findById(userId)
        if (!userData) {
            return res.json({ success: false, message: 'User Not Found' })
        }
        let cartData = userData.cartData
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1
        }
        await User.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: 'Removed From Cart'})
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Error' })
    }
}

const getCart = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;
    const userData = await User.findById(userId);
    const cartData = userData.cartData || {};

    const itemIds = Object.keys(cartData);

    // Fetch product details for all cart items
    const products = await Food.find({ _id: { $in: itemIds } });

    res.json({
      success: true,
      cartData,
      products, // send food_list here
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error' });
  }
};


export { addToCart, removeFromCart, getCart }