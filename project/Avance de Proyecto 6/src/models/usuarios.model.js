const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class Usuario {

    constructor(nuevo_usuario) {
        this.userName = nuevo_usuario.userName;
        this.userPass = nuevo_usuario.userPass;
        this.userMail = nuevo_usuario.userMail;
        this.userCel = nuevo_usuario.userCel;
        this.userSkill = nuevo_usuario.userSkill;
        this.userWeekAP = nuevo_usuario.userWeekAp;
    }

    save() {
        return bcrypt.hash(this.userPass, 12)
        .then((password_cifrado) => {
            return db.execute(`
                INSERT INTO users (user_Name, user_Password, user_Mail, user_Phone, user_Skill, user_WeeklyAgilePoints)
            values (?, ?, ?, ?, ?, ?)
            `, [this.userName, password_cifrado, this.userMail, this.userCel, this.userSkill, this.userWeekAP]);
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

    static fetchAllUsers(){
        return db.execute(`
            SELECT * 
            FROM users
        `,);
    }

    static fetchUserId(userid){
        return db.execute(`
            SELECT * 
            FROM users
            WHERE user_ID = ?
        `, [userid]);
    }

    static fetchUser(username){
        return db.execute(`
            SELECT * 
            FROM users
            WHERE user_Name = ?
        `, [username]);
    }

    static fetchAllNames(){
        return db.execute(`
            SELECT user_Name FROM users
        `);
    }

    static fetchAllNamesAssignees(){
        return db.execute(`
            SELECT user_Name, ticket_Assignee FROM users
        `);
    }

    static updateTicketInfo(user, ticket_Assignee, ticket_Assignee_ID){
        return db.execute(`
            UPDATE users
            SET 
            ticket_Assignee = ?,
            ticket_Assignee_ID = ?
            WHERE user_Name = ?
        `, [ticket_Assignee, ticket_Assignee_ID, user]);
    }

    static updateAccount(user_Name, user_Mail, user_Phone, user_Skill, user_WeeklyAgilePoints, user){
        return db.execute(`
            UPDATE users
            SET 
            user_Name = ?,
            user_Mail = ?,
            user_Phone = ?,
            user_Skill = ?,
            user_WeeklyAgilePoints = ?
            WHERE user_Name = ?
        `, [user_Name, user_Mail, user_Phone, user_Skill, user_WeeklyAgilePoints, user]);
    }

    static updatethisAccount(user_Name, user_Mail, user_Phone, user_Skill, user_WeeklyAgilePoints, user) {
        return db.execute(`
            UPDATE users
            SET 
            user_Name = ?,
            user_Mail = ?,
            user_Phone = ?,
            user_Skill = ?,
            user_WeeklyAgilePoints = ?
            WHERE user_name = ?
        `, [user_Name, user_Mail, user_Phone, user_Skill, user_WeeklyAgilePoints, user]);
    }

    static deleteUser(userid) {
        return db.execute(`
            DELETE FROM users
            WHERE user_ID = ?
            LIMIT 1
        `, [userid]);
    }

    static fetchprivilegios(user_Name) {
        return db.execute(`
            SELECT p.nombre
            FROM users u, usuario_rol ur, roles r, rol_privilegio rp, privilegios p
            WHERE u.user_ID = ur.idUsuario AND ur.idRol = r.id AND rp.idRol = r.id 
                AND rp.idPrivilegio = p.id AND u.user_Name = ?        
        `, [user_Name]);
    }
}