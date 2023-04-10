const Dispatch = require('../models/dispatch.model');
const bcrypt = require('bcryptjs');

exports.get_inicio = (request, response, next) => {
    response.render('inicio')
};