const db = require('../util/database');

module.exports = class Project {
  constructor(nuevo_proyecto) {
    this.project_Name = nuevo_proyecto.name;
    //this.report_ID = nuevo_proyecto.report_ID;
    //this.epic_Link = nuevo_proyecto.epic_Link;
  }

  save() {
    return db.execute(
      `
                INSERT INTO projects (project_Name)
            values (?)
            `,
      [this.project_Name]
    );
  }

  static fetchAll() {
    return db.execute(`
            SELECT * 
            FROM projects
        `);
  }

  static fetchOne(projectName) {
    return db.execute(
      `
            SELECT * 
            FROM projects
            WHERE project_Name = ?
        `,
      [projectName]
    );
  }

  static find(valorBusqueda) {
    return db.execute(
      `
        SELECT project_Name
        FROM projects
        WHERE (project_Name LIKE ?)
        `,
      ['%' + valorBusqueda + '%',]
    );
  }

  static detail(ProjectDetail) {
    return db.execute(
      `
        SELECT p.project_Name, p.project_ID, e.epic_Link, e.epic_Link_Summary 
        FROM project_epics pe, projects p, epics e
        WHERE p.project_ID = pe.project_ID
        AND e.epic_ID = pe.epic_ID
        AND p.project_ID = ?
        `,
      [ProjectDetail]
    );
  }

  static progress(ProjectProgress) {
    return db.execute(
      `
            SELECT project_Name, ROUND(AVG(progreso),0) AS progreso
            FROM (
            SELECT p.project_Name, get_progreso(e.epic_Link) AS progreso
            FROM project_epics pe, projects p, epics e
            WHERE p.project_ID = pe.project_ID
            AND e.epic_ID = pe.epic_ID
            AND p.project_Name = ?
            ) AS progress;
                `,
      [ProjectProgress]
    );
  }

  static fetchTickets(id) {
    return db.execute(
      `
            SELECT ticket_status, COUNT(*) AS count
            FROM tickets
            WHERE epic_Link IN (
            SELECT epic_Link
            FROM epics e, projects p, project_epics pe
            WHERE p.project_ID = pe.project_ID
            AND p.project_ID = ?
            )
            GROUP BY ticket_status;`,
      [id]
    );
  }

  static updateProject(proj_Name, id) {
    return db.execute(
      `
        UPDATE projects
        SET project_Name = ?
        WHERE project_Name = ?
        LIMIT 1;
        `,
      [proj_Name, id]
    );
  }

  static fetchDoughnutChart(name) {
    return db.execute(
      `
            SELECT ticket_status, COUNT(*) AS count
            FROM tickets
            WHERE epic_Link IN (
            SELECT epic_Link
            FROM epics e, projects p, project_epics pe
            WHERE p.project_ID = pe.project_ID
            AND p.project_name = ?
            )
            GROUP BY ticket_status;`,
      [name]
    );
  }
};