exports.get_proyectos = (request, response, next) => {
    response.render('proyectos', {
    isLoggedIn: request .session.isLoggedIn || false,
    username: request.session.username || "",
    titulo: "DispatchHealth",
  });
};