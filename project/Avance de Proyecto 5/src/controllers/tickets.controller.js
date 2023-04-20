const Ticket = require('../models/tickets.model');


exports.get_ticket = (request, response, next) => {
  response.render('tickets', {
      isLoggedIn: request.session.isLoggedIn || false,
      nombre: request.session.nombre || ''
  });
}

exports.viewTicket = (req, res) => {
Ticket.viewTicket()
  .then(([tickets]) => {
    res.render('tickets', { tickets: tickets });
  })
  .catch(err => console.log(err));
};


