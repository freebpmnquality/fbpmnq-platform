function calculateDiscreteCriteria(measures) {
    var r1 = measures.totalNodes <= 31 ? 1 : 0;

    var r2 = (measures.invalidTasks + measures.invalidEvents + measures.uncertainGateways) === 0 ? 1 : 0;

    var r3 = Math.min(measures.startEvents === 1 ? 1 : 0, measures.endEvents === 1 ? 1 : 0);

    var r4 = measures.gatewaysMismatch === 0 ? 1 : 0;

    var r5 = measures.inclusiveGateways === 0 ? 1 : 0;

    return {
        "R1": r1,
        "R2": r2,
        "R3": r3,
        "R4": r4,
        "R5": r5
    };
}

function calculateContinuousCriteria(measures) {
    var r1 = measures.totalNodes <= 31 ? 1 : (31 / measures.totalNodes);

    var r2 = 1 - (measures.invalidTasks + measures.invalidEvents + measures.uncertainGateways) / measures.totalNodes;

    var r3 = Math.min(1 / (1 + Math.pow(measures.startEvents - 1, 2)), 1 / (1 + Math.pow(measures.endEvents - 1, 2)));

    var r4 = measures.gatewaysMismatch === 0 ? 1 : 1 - (measures.gatewaysMismatch / measures.totalGateways);

    var r5 = measures.inclusiveGateways === 0 ? 1 : 1 - (measures.inclusiveGateways / measures.totalGateways);

    return {
        "R1": r1,
        "R2": r2,
        "R3": r3,
        "R4": r4,
        "R5": r5
    };
}

module.exports.calculateDiscreteCriteria = calculateDiscreteCriteria;
module.exports.calculateContinuousCriteria = calculateContinuousCriteria;