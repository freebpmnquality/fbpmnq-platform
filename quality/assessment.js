var fs = require("fs");

var measurement = require("./measurement");

function assessQuality(process, measures) {
    var content = fs.readFileSync("./quality/database.json", "utf8");
    var results = JSON.parse(content);

    var discrete = measurement.calculateDiscreteCriteria(measures);
    var continuous = measurement.calculateContinuousCriteria(measures);

    var discreteQuality = Math.min(discrete.R1, discrete.R2, discrete.R3, discrete.R4, discrete.R5);
    var continuousQuality = discreteQuality; // TODO

    var data = JSON.stringify(results);
    fs.writeFileSync("./quality/database.json", data);

    return { "discrete": discreteQuality, "continuous": continuousQuality }
}

module.exports.assessQuality = assessQuality;