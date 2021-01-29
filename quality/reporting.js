const StormDB = require("stormdb");

const engine = new StormDB.localFileEngine("./quality/quality.json");
const db = new StormDB(engine);

function saveReport(report) {
    var results = db.get("results").value();

    report.id = results.length;

    db.get("results").push(report);
    db.save();
}

function getAllReports(uid) {
    var reports = db.get("results").value();

    var results = [];

    for (var i = 0; i < reports.length; i++) {
        if (reports[i].uid === uid) {
            results.push(reports[i]);
        }
    }

    return results;
}

function getReportById(id) {
    var reports = db.get("results").value();

    var result = null;

    for (var i = 0; i < reports.length; i++) {
        if (reports[i].id == id) {
            result = reports[i];
            break;
        }
    }

    return result;
}

module.exports.saveReport = saveReport;
module.exports.getAllReports = getAllReports;
module.exports.getReportById = getReportById;