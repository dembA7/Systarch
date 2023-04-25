const Epic = require('../models/epics.model');

exports.get_homepage = (request, response, next) => {
  
  Epic.Progress()
  .then(([rows, fieldData]) => {
    response.render('homepage', {
      isLoggedIn: request .session.isLoggedIn || false,
      epics: rows,
      username: request.session.nombre,
      titulo: "DispatchHealth"
    });
  }).catch(err => console.log(err));
  

};

exports.get_buscar = (request, response, next) => {
  Epic.find(request.params.valorBusqueda) 
  .then(([epic_consulta, fieldData]) => {
    response.status(200).json({
      epics: epic_consulta,
      isLoggedIn: request.session.isLoggedIn || false
    });
  })
  .catch(err => {
    console.log(err);
    response.status(500).json({message: "Internal Server Error"});
  })
}
