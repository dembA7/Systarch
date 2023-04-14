const Epic = require('../models/epics.model');

exports.get_inicio = (request, response, next) => {
  
  // let res = Epic.ticketsTotal('PART-289');
  Epic.fetchAll()
  .then(([rows_Epic, fieldData]) => {
    Epic.ticketsTotal('PART-289')
    .then(([total, fieldData]) => {
      Epic.ticketsDone('PART-289')
      .then(([done, fieldData]) => {
        response.render('inicio', {
          isLoggedIn: request .session.isLoggedIn || false,
          epics: rows_Epic,
          username: request.session.nombre,
          titulo: "DispatchHealth",
          ttotal: total,
          tdone: done,
        });
      }).catch(err => console.log(err)); 
    }).catch(err => console.log(err)); 
  }).catch(err => console.log(err));
  

}; 