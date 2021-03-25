const fs = require("fs");

const parser = require("./model/parser")
const measurement = require("./quality/measurement");
const assessment = require("./quality/assessment");

const args = process.argv.slice(2);
const folder = args[0];
const path = "./repository/" + folder + "/";

var stream = fs.createWriteStream("./statistics/" + folder + ".csv");

stream.once("open", function() {
    console.log("Processing BPMN models:");

    stream.write(
        "file," +

        "w1,w2,w3,w4,w5," +

        "d.R1,d.R2,d.R3,d.R4,d.R5," +
        "c.R1,c.R2,c.R3,c.R4,c.R5," +

        "d.wsm,d.min,d.wsml,d.minl," +
        "c.wsm,c.min,c.wsml,c.minl\n"
    );

    var modelsCount = 0;

    const reportingCondition = modelsCount => modelsCount % 500 === 0;

    fs.readdirSync(path).forEach(file => {
        var xmlModel = fs.readFileSync(path + file, "utf8");
        var measuresList = parser.parse(xmlModel);

        for (var k in measuresList) {
            modelsCount++;

            var measures = measuresList[k];

            var discrete = measurement.calculateDiscreteCriteria(measures);
            var continuous = measurement.calculateContinuousCriteria(measures);

            assessment.recalculateWeights(discrete);

            var report = assessment.assessQuality(discrete, continuous);

            if (reportingCondition(modelsCount)) {
                stream.write(
                    file + "," +

                    assessment.weights.R1 + "," +
                    assessment.weights.R2 + "," +
                    assessment.weights.R3 + "," +
                    assessment.weights.R4 + "," +
                    assessment.weights.R5 + "," +

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
        }

        console.log(file);
    });

    stream.end();
});