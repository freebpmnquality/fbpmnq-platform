var fs = require("fs");
const { report } = require("process");

var measurement = require("./measurement");
var reporting = require("./reporting");

function assessQuality(process, measures, uid, raw) {
    var discrete = measurement.calculateDiscreteCriteria(measures);
    var continuous = measurement.calculateContinuousCriteria(measures);

    var discreteQualityWSM = 0.21 * discrete.R1 + 0.19 * discrete.R2 + 0.16 * discrete.R3 + 0.28 * discrete.R4 + 0.16 * discrete.R5;
    var discreteQualityMIN = Math.min(discrete.R1, discrete.R2, discrete.R3, discrete.R4, discrete.R5);

    var continuousQualityWSM = 0.21 * continuous.R1 + 0.19 * continuous.R2 + 0.16 * continuous.R3 + 0.28 * continuous.R4 + 0.16 * continuous.R5;
    var continuousQualityMIN = Math.min(continuous.R1, continuous.R2, continuous.R3, continuous.R4, continuous.R5);


    var report = {
        process: process,
        measures: {
            initial: measures,
            discrete: discrete,
            continuous: continuous
        },
        quality: {
            discrete: {
                wsm: discreteQualityWSM.toFixed(2),
                min: discreteQualityMIN
            },
            continuous: {
                wsm: continuousQualityWSM.toFixed(2),
                min: continuousQualityMIN.toFixed(2)
            }
        },
        timestamp: new Date().toLocaleString(),
        uid: uid,
        raw: raw
    };

    reporting.saveReport(report);

    return report;
}

module.exports.assessQuality = assessQuality;