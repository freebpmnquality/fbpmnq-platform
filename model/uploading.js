const StormDB = require("stormdb");

function uploadModel(bpmnModel, fileName, userId) {
    const engine = new StormDB.localFileEngine("./model/model.json");
    const db = new StormDB(engine);

    var models = db.get("models").value();

    var modelId = models.length;

    var model = {
        id: modelId,
        raw: bpmnModel,
        file: fileName,
        uid: userId,
        timestamp: new Date().toLocaleString()
    };

    db.get("models").push(model);
    db.save();
}

function uploadModelFeatures(bpmnModel, fileName, userId, metadata, report) {
    const engine = new StormDB.localFileEngine("./model/search.json");
    const db = new StormDB(engine);

    var features = db.get("features").value();

    var featureId = features.length;

    var feature = {
        id: featureId,
        raw: bpmnModel,
        file: fileName,
        uid: userId,
        timestamp: new Date().toLocaleString(),
        metadata: metadata,
        measures: report.measures,
        quality: report.quality,
        process: report.process
    };

    db.get("features").push(feature);
    db.save();
}

module.exports.uploadModel = uploadModel;
module.exports.uploadModelFeatures = uploadModelFeatures;