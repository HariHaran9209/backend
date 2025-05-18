import { CurrencyCodes } from 'validator/lib/isISO4217.js'
import Order from '../models/Order.model.js'
import User from '../models/User.model.js'
import Stripe from 'stripe'
import dotenv from 'dotenv'
dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const placeOrder = async (req, res) => {
    
    const frontend_url = 'http://localhost:5173'
    
    try {
        const newOrder = new Order({
            userId: req.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        })
        await newOrder.save()
        await User.findByIdAndUpdate(req.userId, {cartData: {}})

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.name
                },
                unit_amount: item.price*100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: 2*100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        })

        res.json({ success: true, session_url: session.url })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body
    try {
        if ( success === true || success === 'true' ) {
            await Order.findByIdAndUpdate(orderId, { payment: true })
            res.json({ success: true, message: "Paid" })
        } else {
            await Order.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Not Paid"})
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Error' })
    }
}

const userOrders = async (req, res) => {
    try {
        console.log('Request headers: ', req.headers)
        console.log('Request userId: ', req.userId)
        if (!req.userId) {
            return res.status(401).json({ success: false, message: 'User ID not found in request' })
        }
        const totalOrders = await Order.countDocuments()
        console.log('Total orders in database: ', totalOrders)

        const orders = await Order.find({ userId: req.userId })
        console.log('Found orders: ', orders)

        const allOrders = await Order.find()
        console.log('All Orders: ', allOrders)

        res.json({
            success: true,
            data: orders,
            debug: {
                totalOrders,
                allOrders
            }
        })
    } catch (error) {
        console.error('Error in userOrders: ', error)
        res.json({ success: false, message: error.message })        
    }
}

const listOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Error' })
    }
}

const updateStatus = async (req, res) => {
    try {
        await Order.findByIdAndUpdate(req.body.orderId, { status: req.body.status })
        res.json({ success: true, message: 'Status Updated' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Error' })
    }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus }