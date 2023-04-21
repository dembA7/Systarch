const db = require('../util/database');

module.exports = class Project {

    constructor(nuevo_proyecto) {
        this.project_Name = nuevo_proyecto.name;
        //this.report_ID = nuevo_proyecto.report_ID;
        //this.epic_Link = nuevo_proyecto.epic_Link;
    }

    save() {
        return db.execute(`
                INSERT INTO projects (project_Name)
            values (?)
            `, [this.project_Name]);
    }

    static fetchAll(){
        return db.execute(`
            SELECT * 
            FROM projects
        `);
    }

    static fetchOne(projectName){
        return db.execute(`
            SELECT * 
            FROM projects
            WHERE project_Name = ?
        `, [projectName]);
    }

}