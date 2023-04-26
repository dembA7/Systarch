const Ticket = require('../models/tickets.model');


exports.get_ticket = (request, response, next) => {
  return Ticket.viewTicket()
  .then(([tickets]) => {
    // console.log("Requested tickets details")
    response.render('tickets', {
      isLoggedIn: request.session.isLoggedIn || false,
      nombre: request.session.nombre || '',
      tickets: tickets,
      privilegios: request.session.privilegios || [],
    });  
  })
  .catch(error => {
    console.log(error);
    next(error);
  });
}

exports.get_buscar = (request, response, next) => {
 Ticket.find(request.params.valorBusqueda)
 .then(([ticket_consulta, fieldData]) => {
  response.status(200).json({
    tickets: ticket_consulta,
    sisLoggedIn: request.session.isLoggedIn || false
  });
})
.catch(err => {
  console.log(err);
  response.status(500).json({message: "Internal Server Error"});
})
}

