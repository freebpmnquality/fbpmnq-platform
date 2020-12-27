var fs = require("fs");
const { report } = require("process");

var measurement = require("./measurement");
var reporting = require("./reporting");

function assessQuality(process, measures, uid) {
    var discrete = measurement.calculateDiscreteCriteria(measures);
    var continuous = measurement.calculateContinuousCriteria(measures);

    var discreteQuality = Math.min(discrete.R1, discrete.R2, discrete.R3, discrete.R4, discrete.R5);
    var continuousQuality = 0.21 * continuous.R1 + 0.19 * continuous.R2 + 0.16 * continuous.R3 + 0.28 * continuous.R4 + 0.16 * continuous.R5;

    var report = {
        process: process,
        measures: {
            discrete: discrete,
            continuous: continuous
        },
        quality: {
            discrete: discreteQuality,
            continuous: continuousQuality.toFixed(2)
        },
        timestamp: new Date().toLocaleString(),
        uid: uid
    };

    reporting.saveReport(report);

    return report;
}

module.exports.assessQuality = assessQuality;