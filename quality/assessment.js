var fs = require("fs");
const { report } = require("process");

var measurement = require("./measurement");
var reporting = require("./reporting");

function assessQuality(process, measures) {
    var discrete = measurement.calculateDiscreteCriteria(measures);
    var continuous = measurement.calculateContinuousCriteria(measures);

    var discreteQuality = Math.min(discrete.R1, discrete.R2, discrete.R3, discrete.R4, discrete.R5);
    var continuousQuality = 0.21 * discrete.R1 + 0.19 * discrete.R2 + 0.16 * discrete.R3 + 0.28 * discrete.R4 + 0.16 * discrete.R5;

    var report = {
        "process": process,
        "discrete": discreteQuality,
        "continuous": continuousQuality.toFixed(2)
    };

    reporting.saveReport(report);

    return report;
}

module.exports.assessQuality = assessQuality;