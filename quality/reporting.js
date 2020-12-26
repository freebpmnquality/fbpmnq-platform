var fs = require("fs");

function saveReport(report) {
    var content = fs.readFileSync("./quality/database.json", "utf8");
    var results = JSON.parse(content);



    var data = JSON.stringify(results);
    fs.writeFileSync("./quality/database.json", data);
}

module.exports.saveReport = saveReport;