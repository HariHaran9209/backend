import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import { connectDB } from './config/db.js'
import userRouter from './routes/User.route.js'
import cartRouter from './routes/Cart.route.js'
import foodRouter from './routes/Food.route.js'
import orderRouter from './routes/Order.route.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000
const __dirname = path.resolve()

app.use(express.json())
app.use(cors())

app.use('/api/user', userRouter)
app.use('/api/cart', cartRouter)
app.use('/api/food', foodRouter)
app.use('/api/order', orderRouter)

app.use(express.static(path.join(__dirname, 'frontend')))

    // app.get('*', (req, res) => {
    // const indexPath = path.join(__dirname, 'frontend', 'index.html')
    // res.sendFile(indexPath, function (err) {
    // if (err) {
    //     res.status(500).send('index.html not found')
    // }
    // })
    // })

app.listen(port, () => {
    connectDB()
    console.log(`Server Is Running At http://localhost:${port}`)
}) 
