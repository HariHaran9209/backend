import jwt from 'jsonwebtoken'

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers
    if (!token) {
        return res.status(401).json({ success: false, message: 'No Token Provided' })
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = token_decode.id
        next()
    } catch (error) {
        console.log(`JWT verification failed: ${error.message}`)
        return res.status(401).json({ success: false, message: 'Invalid Or Expired Token'})
    }
} 

export default authMiddleware