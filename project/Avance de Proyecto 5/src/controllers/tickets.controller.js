const Ticket = require('../models/tickets.model');


exports.get_ticket = (request, response, next) => {
  return Ticket.viewTicket()
  .then(([tickets]) => {
    // console.log("Requested tickets details")
    response.render('tickets', {
      isLoggedIn: request.session.isLoggedIn || false,
      nombre: request.session.nombre || '',
      tickets: tickets
    });  
  })
  .catch(error => {
    console.log(error);
    next(error);
  });
}


