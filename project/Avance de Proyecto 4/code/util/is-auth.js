module.exports = (request, response, next) => {
    if (!request.session.isLoggedIn) {
        return response.redirect('/usuarios/login');
    }
    next();
}