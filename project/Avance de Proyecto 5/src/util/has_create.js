module.exports = (request, response, next) => {
    if (!(request.session.privilegios.indexOf('crear_usuarios') >= 0)) {
        return response.redirect('/account');
    }
    next();
}