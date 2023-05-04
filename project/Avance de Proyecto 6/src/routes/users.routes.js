const express = require('express');

const isAuth = require("../util/is-auth");

const hasCreate = require("../util/has_create");

const router = express.Router();

const usersController = require('../controllers/users.controller');

router.get('/login', usersController.get_login);

router.post('/login', usersController.post_login);

router.get('/signup', hasCreate, usersController.get_signup);

router.post('/signup', hasCreate, usersController.post_signup);

router.get('/account', isAuth, usersController.get_account);

router.get('/account/edit', isAuth, usersController.edit_account);

router.post('/account/edit', isAuth, usersController.post_account);

router.get('/totalusers', isAuth, usersController.get_totalUsers);

router.get('/account/edituser/:id', isAuth, usersController.get_thisAccount);

router.post('/account/edituser/:id/', isAuth, usersController.post_thisAccount);

router.post('/account/edituser/:id/delete', isAuth, usersController.deleteAccount);

router.get('/timeout', usersController.timeout);

router.get('/logout', usersController.logout);

module.exports = router;