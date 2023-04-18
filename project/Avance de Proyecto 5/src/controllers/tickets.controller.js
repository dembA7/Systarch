const Ticket = require('../models/tickets.model');

exports.get_ticket = (request, response, next) => {
    response.render('tickets', {
        isLoggedIn: request.session.isLoggedIn || false,
        nombre: request.session.nombre || '',
      });
}