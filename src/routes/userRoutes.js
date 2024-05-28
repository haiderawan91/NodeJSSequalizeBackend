const express = require('express');
const { getAllUsers, createUser } = require('../controllers/userController');

const router = express.Router();

router.get('/users', getAllUsers);
router.post('/Register_user', createUser);

module.exports = router;
