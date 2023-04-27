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
  const valorBusqueda = request.params.valorBusqueda;
  const statusFilter = request.query.status; // Obtener el valor del filtro desde la URL de la solicitud

  Ticket.find(valorBusqueda)
    .then(([ticket_consulta, fieldData]) => {
      let filteredTickets = ticket_consulta;
      if (statusFilter) {
        console.log(statusFilter);
        // Si se ha proporcionado un valor de filtro, filtrar los tickets según ese valor
        filteredTickets = ticket_consulta.filter(ticket => ticket.Status === statusFilter);
      }

      response.status(200).json({
        tickets: filteredTickets,
        sisLoggedIn: request.session.isLoggedIn || false
      });
    })
    .catch(err => {
      console.log(err);
      response.status(500).json({message: "Internal Server Error"});
    })
}
