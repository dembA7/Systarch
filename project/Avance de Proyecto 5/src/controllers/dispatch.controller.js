const Epic = require('../models/epics.model');

exports.get_homepage = (request, response, next) => {
  
  Epic.Progress()
  .then(([rows, fieldData]) => {
    response.render('homepage', {
      isLoggedIn: request .session.isLoggedIn || false,
      epics: rows,
      username: request.session.nombre,
      titulo: "DispatchHealth",
    });
  }).catch(err => console.log(err));
  

};

exports.get_buscar = (request, response, next) => {
  Epic.find(request.params.id)
  .then(([epic_consulta, fieldData]) => {
    if(epic_consulta.length == 1){
      const epic = new Epic
    }
  })
}