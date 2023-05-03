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

    static find(valorBusqueda){
        return db.execute(`
        SELECT project_ID, project_Name
        FROM projects
        WHERE (project_Name LIKE ?)
        `, ['%' + valorBusqueda + '%']
        );
    }

    static detail(ProjectDetail){
    return db.execute(`
        static 
        SELECT p.Project_Name, p.Project_ID, e.epic_Link_Summary 
        FROM Projects p 
        INNER JOIN Epics e ON e.Project_ID = p.Project_ID;
        `,
        );
    
    }

    static progress(ProjectProgress){
    return db.execute(`
        SELECT p.Project_Name, get_progreso(e.epic_Link) AS progreso
        FROM Projects p
        INNER JOIN epics e ON p.Project_ID = e.Project_ID
        WHERE p.Project_Name = ?
        `,[ProjectProgress])
        ;
    }

}