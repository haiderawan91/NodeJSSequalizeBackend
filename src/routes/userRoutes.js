const express = require('express');
const { getAllUsers, createUser, getUser } = require('../controllers/userController');

const router = express.Router();

router.get('/users', getAllUsers);
router.post('/Register_user', createUser);
router.get('/Get_user', getUser);

module.exports = router;
