const Epic = require('../models/epics.model');

exports.get_inicio = (request, response, next) => {
  
  Epic.Progreso()
  .then(([rows, fieldData]) => {
    response.render('inicio', {
      isLoggedIn: request .session.isLoggedIn || false,
      epics: rows,
      username: request.session.nombre,
      titulo: "DispatchHealth",
    });
  }).catch(err => console.log(err));
  

}; 