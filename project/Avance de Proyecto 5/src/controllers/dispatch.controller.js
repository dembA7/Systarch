const Epic = require('../models/epics.model');
const User = require('../models/usuarios.model');

exports.get_inicio = (request, response, next) => {
  
  User.fetchUser()
    response.render('inicio', {
    isLoggedIn: request .session.isLoggedIn || false,
    username: request.session.username || "",
    titulo: "DispatchHealth",

  }); 
};