var fs = require("fs");

function uploadModel(bpmnModel, fileName, userId) {
    var data = fs.readFileSync("./model/database.json", "utf8");
    var models = JSON.parse(data);

    var modelId = Math.max.apply(Math, models.map(function(o) { return o.id; })) + 1;

    var model = {
        id: modelId,
        raw: bpmnModel,
        file: fileName,
        uid: userId,
        timestamp: new Date().toLocaleString()
    };

    models.push(model);

    var data = JSON.stringify(models);
    fs.writeFileSync("./model/database.json", data);
}

module.exports.uploadModel = uploadModel;