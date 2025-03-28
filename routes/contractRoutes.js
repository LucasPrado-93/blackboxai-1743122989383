const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');
const { authMiddleware } = require('../utils/auth');
const { validateContract } = require('../middleware/validation');

// Create a new contract
router.post('/', authMiddleware, validateContract, contractController.createContract);

// Get all contracts for current user
router.get('/', authMiddleware, contractController.getContracts);

// Get a specific contract
router.get('/:id', authMiddleware, contractController.getContract);

// Update a contract
router.put('/:id', authMiddleware, validateContract, contractController.updateContract);

// Delete a contract
router.delete('/:id', authMiddleware, contractController.deleteContract);

// Sign a contract
router.post('/:id/sign', authMiddleware, contractController.signContract);

module.exports = router;