var weights = {
    discrete: {
        "R1": 0.21,
        "R2": 0.19,
        "R3": 0.16,
        "R4": 0.28,
        "R5": 0.16
    },
    continuous: {
        "R1": 0.21,
        "R2": 0.19,
        "R3": 0.16,
        "R4": 0.28,
        "R5": 0.16
    }
};

function wsmCriteria(weights, criteria) {
    var result = 0;

    for (const key in weights) {
        result += weights[key] * criteria[key];
    }

    return result;
}

function minCriteria(weights, criteria) {
    var result = [];

    for (const key in weights) {
        result.push(weights[key] * criteria[key]);
    }

    const max = Math.max(...result);

    for (let i = 0; i < result.length; i++) {
        result[i] /= max;
    }

    return Math.min(...result);
}

function assessQuality(discrete, continuous) {
    var discreteQualityWSM = wsmCriteria(weights.discrete, discrete);
    var discreteQualityMIN = minCriteria(weights.discrete, discrete);

    var continuousQualityWSM = wsmCriteria(weights.continuous, continuous);
    var continuousQualityMIN = minCriteria(weights.continuous, continuous);

    var report = {
        measures: {
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
        timestamp: new Date().toLocaleString()
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

module.exports.weights = weights;
module.exports.assessQuality = assessQuality;