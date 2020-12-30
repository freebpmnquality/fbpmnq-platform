var fs = require("fs");

function saveReport(report) {
    var content = fs.readFileSync("./quality/quality.json", "utf8");
    var results = JSON.parse(content);

    report.id = results.length;

    results.push(report);

    var data = JSON.stringify(results);
    fs.writeFileSync("./quality/quality.json", data);
}

function getAllReports(uid) {
    var content = fs.readFileSync("./quality/quality.json", "utf8");
    var reports = JSON.parse(content);

    var results = [];

    for (var i = 0; i < reports.length; i++) {
        if (reports[i].uid === uid) {
            results.push(reports[i]);
        }
    }

    return results;
}

function getReportById(id) {
    var content = fs.readFileSync("./quality/quality.json", "utf8");
    var reports = JSON.parse(content);

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