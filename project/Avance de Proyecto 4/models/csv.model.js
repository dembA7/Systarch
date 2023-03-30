const db = require('../util/database');

module.exports = class fileCSV {
    constructor(csv) {
        this.csvName = csv.name;
        this.user = csv.uploadBy;
    }
}