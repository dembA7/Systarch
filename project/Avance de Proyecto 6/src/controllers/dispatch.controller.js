const Epic = require('../models/epics.model');

exports.get_homepage = (request, response, next) => {
  
  Epic.Progress()
  .then(([rows, fieldData]) => {
    response.render('homepage', {
      isLoggedIn: request .session.isLoggedIn || false,
      epics: rows,
      username: request.session.nombre,
      titulo: "DispatchHealth",
      privilegios: request.session.privilegios || [],
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

exports.post_edit = (request, response, next) => {
  const id = request.params.id;
  const { epic_Summary, epic_createdAt } = request.body;
  Epic.updateEpic(epic_Summary,epic_createdAt,id)
  .then(([rows, fieldData]) => {
    response.status(200).end();
  })
  .catch(err => {
    console.log(err)
    response.status(500).json({message: "Internal Server Error"});
  });
};
