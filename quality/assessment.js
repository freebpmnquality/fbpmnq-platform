function assessQuality(process, measures, uid, raw, discrete, continuous) {
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
                wsm: discreteQualityWSM,
                min: discreteQualityMIN,
                wsml: getLinguisticQuality(discreteQualityWSM),
                minl: getLinguisticQuality(discreteQualityMIN)
            },
            continuous: {
                wsm: continuousQualityWSM,
                min: continuousQualityMIN,
                wsml: getLinguisticQuality(continuousQualityWSM),
                minl: getLinguisticQuality(continuousQualityMIN)
            }
        },
        timestamp: new Date().toLocaleString(),
        uid: uid,
        raw: raw
    };

    return report;
}

function getLinguisticQuality(quality) {
    if (quality >= 0.80 && quality <= 1.00) {
        return "Good";
    }

    if (quality >= 0.64 && quality < 0.80) {
        return "Well";
    }

    if (quality >= 0.37 && quality < 0.64) {
        return "Satisfied";
    }

    if (quality >= 0.20 && quality < 0.37) {
        return "Poor";
    }

    if (quality >= 0 && quality < 0.20) {
        return "Bad";
    }

    return "Indefinable";
}

module.exports.assessQuality = assessQuality;