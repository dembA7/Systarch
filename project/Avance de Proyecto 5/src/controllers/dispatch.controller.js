const Epic = require('../models/epics.model');

exports.get_inicio = (request, response, next) => {
  
  let res = Epic.Progreso('PART-289');
  Epic.fetchAll()
  .then(([rows_Epic, fieldData]) => {
    response.render('inicio', {
      isLoggedIn: request .session.isLoggedIn || false,
      epics: rows_Epic,
      username: request.session.nombre,
      titulo: "DispatchHealth",
      progreso: res,
    });
  }).catch(err => console.log(err));
  
};