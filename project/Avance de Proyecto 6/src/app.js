const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const csrf = require('csurf');
const isAuth = require('./util/is-auth');
const multer = require('multer');

const app = express();

app.use(session({
    secret: 'z0AGH6jvVSVfvHBBcurM', 
    resave: false,
    saveUninitialized: false,
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.json());

//FileSystem

const fileStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        //'upload': Es el directorio del servidor donde se subirán los archivos 
        callback(null, 'public/epics/upload');
    },
    filename: (request, file, callback) => {
        callback(null, file.originalname);
    },
});

const fileFilter = (request, file, callback) => {

    if (file.originalname.match(/\.csv$/)) {
      request.session.mensaje = '';
      console.log("[Info] A user uploaded a .CSV to 'public' folder successfully.");
      callback(null, true);
    }

    else {
        request.session.mensaje = 'Invalid file extension. Please, try again.';
        console.log("[Warn] A user tried to upload an invalid file as a .CSV");
        callback(null, false);
    }
}

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('csvUploaded'));

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

app.use(function (error, request, response, next) {
  if (error.code !== 'EBADCSRFTOKEN') return next(error);

  // Handle CSRF token errors here
  response.redirect('/users/timeout');
});

// Renders
const dispatchUsers = require('./routes/users.routes');
const dispatchHomepage = require("./routes/dispatch.routes");
const dispatchEpics = require("./routes/epic.routes");
const dispatchTickets = require("./routes/ticket.routes");
const dispatchProjects = require("./routes/projects.routes");


app.use('/users', dispatchUsers);
app.use('/homepage', isAuth, dispatchHomepage);
app.use('/epics', isAuth, dispatchEpics);
app.use('/tickets', isAuth, dispatchTickets);
app.use('/projects', isAuth, dispatchProjects);


app.use((request, response, next) => {

    response.render('err404', {

        titulo: 'DispatchHealth: ERR404',
        isLoggedIn: request.session.isLoggedIn || false,
        username: request.session.username || '',
        privilegios: request.session.privilegios || [],
    });
});


const port = 3000; 
app.listen(port, () => console.log(`App running on port ${port}.`));
