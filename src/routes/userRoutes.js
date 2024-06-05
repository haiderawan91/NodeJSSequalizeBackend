const express = require('express');
const { getAllUsers, createUser, getUser, login, pdf } = require('../controllers/userController');
const { userAuth } = require('../../auth');

const router = express.Router();

router.get('/users', getAllUsers);
router.post('/Register_user', createUser);
router.get('/Get_user', getUser);
router.post('/login', login);
router.post('/pdf_download', pdf);

module.exports = router;
