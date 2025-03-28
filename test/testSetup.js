const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { generateToken } = require('../utils/auth');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

const createTestUser = async () => {
    const User = require('../models/User');
    const testUser = new User({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123'
    });
    await testUser.save();
    return testUser;
};

const getTestToken = async () => {
    const user = await createTestUser();
    return generateToken(user._id);
};

module.exports = {
    createTestUser,
    getTestToken
};