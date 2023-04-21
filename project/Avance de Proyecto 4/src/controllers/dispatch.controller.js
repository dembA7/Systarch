exports.get_inicio = (request, response, next) => {
    response.render('inicio', {
    isLoggedIn: request .session.isLoggedIn || false,
    username: request.session.username || "",
    titulo: "DispatchHealth",
  });
};