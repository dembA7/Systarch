const express = require("express");

const router = express.Router();

const dispatchController = require('../controllers/dispatch.controller');

router.get('/', (request, response, next) => {
  response.render('inicio', {
    isLoggedIn: request .session.isLoggedIn || true,
    username: request.session.username || "",
    titulo: "DispatchHealth",
  });
});

module.exports = router;
