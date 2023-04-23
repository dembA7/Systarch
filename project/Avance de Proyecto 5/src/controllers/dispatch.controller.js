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

exports.search = (request, response, next) => {

  Epic.find(request.params.valorBusqueda)
  .then(([rows]) => {
        response.status(200).json({epics: rows});
    })

  .catch(error => {
      console.log(error);
      response.status(500).json({message: "Internal Server Error"});
  });

};