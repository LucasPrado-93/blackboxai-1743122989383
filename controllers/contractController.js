const Contract = require('../models/Contract');
const { generatePDF } = require('../utils/pdfGenerator');

const createContract = async (req, res) => {
    try {
        const { title, content } = req.body;
        
        const contract = new Contract({
            title,
            content,
            createdBy: req.userId,
            status: 'draft'
        });

        await contract.save();
        res.status(201).json(contract);
    } catch (error) {
        console.error('Create contract error:', error);
        res.status(500).json({ message: 'Failed to create contract' });
    }
};

const getContracts = async (req, res) => {
    try {
        const contracts = await Contract.find({ 
            $or: [
                { createdBy: req.userId },
                { 'signedBy.user': req.userId }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json(contracts);
    } catch (error) {
        console.error('Get contracts error:', error);
        res.status(500).json({ message: 'Failed to get contracts' });
    }
};

const getContract = async (req, res) => {
    try {
        const contract = await Contract.findOne({
            _id: req.params.id,
            $or: [
                { createdBy: req.userId },
                { 'signedBy.user': req.userId }
            ]
        });

        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        res.status(200).json(contract);
    } catch (error) {
        console.error('Get contract error:', error);
        res.status(500).json({ message: 'Failed to get contract' });
    }
};

const updateContract = async (req, res) => {
    try {
        const { title, content } = req.body;
        
        const contract = await Contract.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.userId, status: 'draft' },
            { title, content },
            { new: true }
        );

        if (!contract) {
            return res.status(404).json({ message: 'Contract not found or not editable' });
        }

        res.status(200).json(contract);
    } catch (error) {
        console.error('Update contract error:', error);
        res.status(500).json({ message: 'Failed to update contract' });
    }
};

const deleteContract = async (req, res) => {
    try {
        const contract = await Contract.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.userId,
            status: 'draft'
        });

        if (!contract) {
            return res.status(404).json({ message: 'Contract not found or not deletable' });
        }

        res.status(200).json({ message: 'Contract deleted successfully' });
    } catch (error) {
        console.error('Delete contract error:', error);
        res.status(500).json({ message: 'Failed to delete contract' });
    }
};

const signContract = async (req, res) => {
    try {
        const { signature } = req.body;
        
        const contract = await Contract.findOneAndUpdate(
            { 
                _id: req.params.id,
                status: 'pending',
                'signedBy.user': { $ne: req.userId }
            },
            { 
                $push: { 
                    signedBy: { 
                        user: req.userId, 
                        signature 
                    } 
                },
                $set: { status: 'signed' }
            },
            { new: true }
        );

        if (!contract) {
            return res.status(404).json({ message: 'Contract not found or already signed' });
        }

        // Generate PDF version
        const pdfBuffer = await generatePDF(contract);
        
        res.status(200).json({
            ...contract.toObject(),
            pdf: pdfBuffer.toString('base64')
        });
    } catch (error) {
        console.error('Sign contract error:', error);
        res.status(500).json({ message: 'Failed to sign contract' });
    }
};

module.exports = {
    createContract,
    getContracts,
    getContract,
    updateContract,
    deleteContract,
    signContract
};