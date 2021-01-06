const fs = require('fs');

const parser = require('./model/parser')
const measurement = require("./quality/measurement");
const assessment = require('./quality/assessment');

const folder = './repository/dispatch/';

var stream = fs.createWriteStream('./statistics.csv');

stream.once('open', function(fd) {
    console.log("Processing BPMN models:");

    fs.readdirSync(folder).forEach(file => {
        var xmlModel = fs.readFileSync(folder + file, 'utf8');
        var measuresList = parser.parse(xmlModel);

        for (var k in measuresList) {
            var measures = measuresList[k];

            var discrete = measurement.calculateDiscreteCriteria(measures);
            var continuous = measurement.calculateContinuousCriteria(measures);

            var report = assessment.assessQuality(discrete, continuous);

            stream.write(
                file + "," +

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