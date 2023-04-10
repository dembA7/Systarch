const Usuario = require('../models/usuarios.model');
const bcrypt = require('bcryptjs');

exports.get_login = (request, response, next) => {
    const mensaje = request.session.mensaje || "";
    if (request.session.mensaje) {
        request.session.mensaje  = '';
    }
  if (request.session.isLoggedIn){
    response.render('inicio',{
      isLoggedIn: request.session.isLoggedIn || false,
      nombre: request.session.nombre || '',
    });
  }
  else{
    response.render('login', {
      isLoggedIn: request.session.isLoggedIn || false,
      nombre: request.session.nombre || '',
    });
  }
};

exports.post_login = (request, response, next) => {

    Usuario.fetchOne(request.body.userMail)
      .then(([rows, fieldData]) => {
        if (rows.length == 1) {
          console.log(rows);
          bcrypt
            .compare(request.body.userPass, rows[0].user_Password)
            .then((doMatch) => {
              if (doMatch) {
                request.session.isLoggedIn = true;
                request.session.nombre = rows[0].user_Name;
                return request.session.save((err) => {
                  response.redirect("/../inicio");
                });
              } 
              else {
                request.session.mensaje = "Usuario y/o contraseña incorrectos";
                console.log("Usuario y/o contraseña incorrectos")
                response.redirect("/usuarios/login");
              }
            })
            .catch((error) => console.log(error));
        }
        else {
          request.session.mensaje = "Usuario y/o contraseña incorrectos";
          response.redirect("/usuarios/login");
        }
      })
      .catch((error) => {
        console.log(error);
      });

};


exports.get_signup = (request, response, next) => {
    response.render('signup', {
      isLoggedIn: request.session.isLoggedIn || false,
      nombre: request.session.nombre || '',
<<<<<<< HEAD
      csrfToken: request.csrfToken(),
=======
      mensaje: request.session.mensaje || '',
      csrfToken: request.csrfToken()
>>>>>>> 7c97761678e3ea132fafb5cd6bf13be47a1f38eb
    });
};

exports.post_signup = (request, response, next) => {
  if (request.body.userPass != request.body.userConfPass){
    request.session.mensaje = 'Las contraseñas no coinciden';
    response.redirect('/usuarios/signup');
  }
  else{
    console.log("Son iguales");
    const usuario = new Usuario({
      userName: request.body.userName || "Anonimo",
      userPass: request.body.userPass || "12345",
      userMail: request.body.userMail || "anon@gmail.com",
      userCel: request.body.userCel || "442123456789",
      userSkill: request.body.userSkill || '3',
    });

    usuario.save()
    .then(([rows, fieldData]) => {
        response.redirect('/usuarios/login');
    }).catch((error) => {console.log(error)});
  }
};

exports.get_account = (request, response, next) => {
    response.render('account')
};

exports.post_account = (request, response, next) => {
    console.log("Esta funcionando");
    
};

exports.logout = (request, response, next) => {
    request.session.destroy(() => {
        response.redirect('/usuarios/login');
    });
};