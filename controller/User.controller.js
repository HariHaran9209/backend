import User from "../models/User.model.js"
import bcrypt from 'bcryptjs'
import validator from 'validator'
import jwt from 'jsonwebtoken'

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

const register = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body
    const hashedPassword = bcrypt.hashSync(password, 10)

    if (password !== confirmPassword) {
        res.status(500).json({ success: false, message: `Passwords Don't Match`})
    }

    const userExists = await User.findOne({ username })

    if (userExists) {
        res.status(500).json({ success: false, message: `Username Was Taken Already`})
    }

    const emailExists = await User.findOne({ email })

    if(emailExists) {
        res.status(500).json({ success: false, message: `Email Already Registered` })
    }

    if (password.length < 8) {
        res.status(500).json({ success: false, message: `Enter A Strong Password` })
    }

    if (!validator.isEmail(email)) {
        res.status(500).json({ success: false, message: `Enter A Valid Email` })
    }

    try {
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        await newUser.save()
        const token = createToken(newUser._id)
        res.status(201).json({ success: true, message: `User Successfully Created For ${username}`, token})
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: `Internal Server Error: ${error}`})
    }
}

const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, message: `User Not Found`})
        }
        const userPassword = bcrypt.compareSync(password, user.password)
        if (!userPassword) {
            return res.status(401).json({ success: false, mesaage: `Wrong Credentials`})
        }
        const token = createToken(user._id)
        res.status(201).json({ success: true, message: `User Logged In Successfully`, token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: `Internal Server Error: ${error}`})
    }
}

export { register, login }