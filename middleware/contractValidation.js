const { body, validationResult } = require('express-validator');

const validateContract = [
    body('title').notEmpty().withMessage('Title is required')
        .isLength({ max: 100 }).withMessage('Title must be less than 100 characters'),
    body('content').notEmpty().withMessage('Content is required')
        .isLength({ min: 50 }).withMessage('Content must be at least 50 characters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateSignature = [
    body('signature').notEmpty().withMessage('Signature is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateContract,
    validateSignature
};