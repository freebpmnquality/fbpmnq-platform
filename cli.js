const fs = require("fs");

const parser = require("./model/parser")
const measurement = require("./quality/measurement");
const assessment = require("./quality/assessment");

const args = process.argv.slice(2);
const folder = args[0];
const path = "./repository/" + folder + "/";

var stream = fs.createWriteStream("./statistics/" + folder + ".csv");

stream.once("open", function(fd) {
    console.log("Processing BPMN models:");

    stream.write(
        "file," +

        "d.w1,d.w2,d.w3,d.w4,d.w5," +
        "c.w1,c.w2,c.w3,c.w4,c.w5," +

        "d.R1,d.R2,d.R3,d.R4,d.R5," +
        "c.R1,c.R2,c.R3,c.R4,c.R5," +

        "d.wsm,d.min,d.wsml,d.minl," +
        "c.wsm,c.min,c.wsml,c.minl\n"
    );

    fs.readdirSync(path).forEach(file => {
        var xmlModel = fs.readFileSync(path + file, "utf8");
        var measuresList = parser.parse(xmlModel);

        for (var k in measuresList) {
            var measures = measuresList[k];

            var discrete = measurement.calculateDiscreteCriteria(measures);
            var continuous = measurement.calculateContinuousCriteria(measures);

            var report = assessment.assessQuality(discrete, continuous);

            // [start] Recalculate 7PMG weights using FCM
            var sumDiscreteWeights = 0;
            var sumContinuousWeights = 0;

            const activation = function(weight, measure) {
                const f = function(x) {
                    return weight / Math.exp(measure);
                };

                return f(weight * measure);
            }

            for (const key in assessment.weights.discrete) {
                const discreteWeight = assessment.weights.discrete[key];
                const discreteMeasure = report.measures.discrete[key];

                const continuousWeight = assessment.weights.continuous[key];
                const continuousMeasure = report.measures.continuous[key];

                assessment.weights.discrete[key] = activation(discreteWeight, discreteMeasure);
                assessment.weights.continuous[key] = activation(continuousWeight, continuousMeasure);

                sumDiscreteWeights += assessment.weights.discrete[key];
                sumContinuousWeights += assessment.weights.continuous[key];
            }

            for (const key in assessment.weights.discrete) {
                assessment.weights.discrete[key] /= sumDiscreteWeights;
                assessment.weights.continuous[key] /= sumContinuousWeights;
            }
            // [/start] Recalculate 7PMG weights using FCM

            stream.write(
                file + "," +

                assessment.weights.discrete.R1 + "," +
                assessment.weights.discrete.R2 + "," +
                assessment.weights.discrete.R3 + "," +
                assessment.weights.discrete.R4 + "," +
                assessment.weights.discrete.R5 + "," +

                assessment.weights.continuous.R1 + "," +
                assessment.weights.continuous.R2 + "," +
                assessment.weights.continuous.R3 + "," +
                assessment.weights.continuous.R4 + "," +
                assessment.weights.continuous.R5 + "," +

                report.measures.discrete.R1 + "," +
                report.measures.discrete.R2 + "," +
                report.measures.discrete.R3 + "," +
                report.measures.discrete.R4 + "," +
                report.measures.discrete.R5 + "," +

                report.measures.continuous.R1 + "," +
                report.measures.continuous.R2 + "," +
                report.measures.continuous.R3 + "," +
                report.measures.continuous.R4 + "," +
                report.measures.continuous.R5 + "," +

                report.quality.discrete.wsm + "," +
                report.quality.discrete.min + "," +
                report.quality.discrete.wsml + "," +
                report.quality.discrete.minl + "," +

                report.quality.continuous.wsm + "," +
                report.quality.continuous.min + "," +
                report.quality.continuous.wsml + "," +
                report.quality.continuous.minl + "\n"
            );
        }

        console.log(file);
    });

    stream.end();
});