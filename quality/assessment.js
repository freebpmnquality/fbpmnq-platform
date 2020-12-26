var fs = require("fs");
const { report } = require("process");

var measurement = require("./measurement");
var reporting = require("./reporting");

function assessQuality(process, measures) {
    var discrete = measurement.calculateDiscreteCriteria(measures);
    var continuous = measurement.calculateContinuousCriteria(measures);

    var discreteQuality = Math.min(discrete.R1, discrete.R2, discrete.R3, discrete.R4, discrete.R5);
    var continuousQuality = discreteQuality; // TODO

    var report = {
        "process": process,
        "discrete": discreteQuality,
        "continuous": continuousQuality
    };

    reporting.saveReport(report);

    return report;
}

module.exports.assessQuality = assessQuality;