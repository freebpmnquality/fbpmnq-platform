var fs = require("fs");

function getAllModels() {
    var data = fs.readFileSync("./model/database.json", "utf8");
    var models = JSON.parse(data);

    return models;
}

function getAllModelsByUserId(uid) {
    var data = fs.readFileSync("./model/database.json", "utf8");
    var models = JSON.parse(data);

    var results = [];

    for (var i = 0; i < models.length; i++) {
        if (models[i].uid === uid) {
            results.push(models[i]);
        }
    }

    return results;
}

function getAllModelsWithFeatures(uid) {
    var models = getAllModelsByUserId(uid);
    var results = models;

    return results;
}

module.exports.getAllModels = getAllModels;
module.exports.getAllModelsByUserId = getAllModelsByUserId;
module.exports.getAllModelsWithFeatures = getAllModelsWithFeatures;