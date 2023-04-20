const db = require('../util/database');

module.exports = class Project {

    constructor(nuevo_proyecto) {
        this.project_ID = nuevo_proyecto.id;
        this.project_Name = nuevo_proyecto.name;
        //this.report_ID = nuevo_proyecto.report_ID;
        this.epic_Link = nuevo_proyecto.epic_Link;
    }

    save() {
        return db.execute(`
                INSERT INTO projects (project_ID, project_Name, epic_Link)
            values (?, ?, ?)
            `, [this.project_ID, this.project_Name, this.epic_Link]);
    }

    static fetchAll(){
        return db.execute(`
            SELECT * 
            FROM projects
        `);
    }

    static fetchOne(project_ID){
        return db.execute(`
            SELECT * 
            FROM projects
            WHERE project_ID = ?
        `, [project_ID]);
    }

}