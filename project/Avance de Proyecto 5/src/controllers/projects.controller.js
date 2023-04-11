exports.get_proyectos = (request, response, next) => {
    response.render('proyectos', {
    isLoggedIn: request .session.isLoggedIn || false,
    username: request.session.username || "",
    titulo: "DispatchHealth",
  });
};

exports.get_crearProyectos = (request, response, next) => {
  response.render('crear', {
  isLoggedIn: request .session.isLoggedIn || false,
  username: request.session.username || "",
  titulo: "DispatchHealth",
});
};