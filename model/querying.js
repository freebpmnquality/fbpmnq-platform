const StormDB = require("stormdb");

function getAllModels() {
    const engine = new StormDB.localFileEngine("./model/model.json");
    const db = new StormDB(engine);

    var models = db.get("models").value();

    return models;
}

function getAllModelsByUserId(uid) {
    const engine = new StormDB.localFileEngine("./model/model.json");
    const db = new StormDB(engine);

    var models = db.get("models").value();

    var results = [];

    for (var i = 0; i < models.length; i++) {
        if (models[i].uid === uid) {
            results.push(models[i]);
        }
    }

    return results;
}

function getAllModelFeatures(uid) {
    const engine = new StormDB.localFileEngine("./model/search.json");
    const db = new StormDB(engine);

    var models = db.get("features").value();

    var results = [];

    for (var i = 0; i < models.length; i++) {
        if (models[i].uid === uid) {
            results.push(models[i]);
        }
    }

    return results;
}

module.exports.getAllModels = getAllModels;
module.exports.getAllModelsByUserId = getAllModelsByUserId;
module.exports.getAllModelFeatures = getAllModelFeatures;