var fs = require("fs");

function uploadModel(bpmnModel, fileName, userId) {
    var data = fs.readFileSync("./model/model.json", "utf8");
    var models = JSON.parse(data);

    var modelId = models.length;

    var model = {
        id: modelId,
        raw: bpmnModel,
        file: fileName,
        uid: userId,
        timestamp: new Date().toLocaleString()
    };

    models.push(model);

    var data = JSON.stringify(models);
    fs.writeFileSync("./model/model.json", data);
}

function uploadModelFeatures(bpmnModel, fileName, userId, metadata, measures) {
    var data = fs.readFileSync("./model/search.json", "utf8");
    var features = JSON.parse(data);

    var featureId = features.length;

    var feature = {
        id: featureId,
        raw: bpmnModel,
        file: fileName,
        uid: userId,
        timestamp: new Date().toLocaleString(),
        metadata: metadata,
        measures: measures
    };

    features.push(feature);

    var data = JSON.stringify(features);
    fs.writeFileSync("./model/search.json", data);
}

module.exports.uploadModel = uploadModel;
module.exports.uploadModelFeatures = uploadModelFeatures;