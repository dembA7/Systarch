const express = require('express');

const isAuth = require("../util/is-auth");

const router = express.Router();

const usersController = require('../controllers/users.controller');

router.get('/login', usersController.get_login);

router.post('/login', usersController.post_login);

router.get('/signup', usersController.get_signup);

router.post('/signup', usersController.post_signup);

router.get('/account', isAuth, usersController.get_account);

router.get('/account/edit', isAuth, usersController.edit_account);

router.post('/account/edit', isAuth, usersController.post_account);

router.get('/timeout', usersController.timeout);

router.get('/logout', usersController.logout);

module.exports = router;