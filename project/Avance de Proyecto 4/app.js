const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const csrf = require('csurf');
const isAuth = require('./util/is-auth');

const app = express();

app.use(session({
    secret: 'z0AGH6jvVSVfvHBBcurM', 
    resave: false,
    saveUninitialized: false,
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}));

// Views
app.set('view engine', 'ejs');
app.set('views', 'views');

// CSRF Protection
const csrfProtection = csrf();
app.use(csrfProtection);

app.use((request, response, next) => {
    response.locals.csrfToken = request.csrfToken();
    next();
});

// Renders
const projUsuarios = require('./routes/usuarios.routes');
const projInicio = require("./routes/dispatch.routes");
const projEpics = require("./routes/epic.routes")
app.use('/usuarios', projUsuarios);
app.use('/inicio', isAuth, projInicio);
app.use('/epics', isAuth, projEpics)

app.use((request, response, next) => {
    response.render('err404', {
        titulo: 'DispatchHealth: ERR404',
        isLoggedIn: request.session.isLoggedIn || false,
        username: request.session.username || '',
    });
});

app.listen(3000);