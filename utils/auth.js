const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (userId, rememberMe = false) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: rememberMe ? '30d' : '1d' }
    );
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ message: 'Token is not valid' });
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    generateToken,
    verifyToken,
    authMiddleware
};