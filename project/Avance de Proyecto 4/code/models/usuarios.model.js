const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class Usuario {

    constructor(nuevo_usuario) {
        this.userName = nuevo_usuario.userName;
        this.userPass = nuevo_usuario.userPass;
        this.userMail = nuevo_usuario.userMail;
        this.userCel = nuevo_usuario.userCel;
        this.userSkill = nuevo_usuario.userSkill;
    }

    save() {
        return bcrypt.hash(this.userPass, 12)
        .then((password_cifrado) => {
            return db.execute(`
                INSERT INTO users (user_Name, user_Password, user_Mail, user_Phone, user_Skill)
            values (?, ?, ?, ?, ?)
            `, [this.userName, password_cifrado, this.userMail, this.userCel, this.userSkill]);
        })
        .catch((error) => {console.log(error)});
    }

    static fetchOne(usermail){
        return db.execute(`
            SELECT * 
            FROM users
            WHERE user_Mail = ?
        `, [usermail]);
    }

}