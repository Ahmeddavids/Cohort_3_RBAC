const express = require('express');
const { signUp, logIn, getAll, scoreUpdate, logOut } = require('../controllers/userController');
const { authenticate, admin } = require('../middleware/authorization');

const router = express.Router();

router.post('/sign-up', signUp);

router.post('/login', logIn);

router.post('/logout', authenticate, logOut);

router.get('/all', admin, getAll);

router.patch('/score/:id', admin, scoreUpdate);




module.exports = router