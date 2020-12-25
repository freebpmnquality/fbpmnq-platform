var express = require("express");
var bodyParser = require("body-parser");

var app = express();
var jsonParser = bodyParser.json();

var authorization = require('./user/authorization');
var uploading = require('./model/uploading');
var querying = require('./model/querying');

app.use(express.static(__dirname + "/public"));

app.post("/api/user/authorization", jsonParser, function(req, res) {
    var login = req.body.login;
    var password = req.body.password;

    var result = authorization.checkUser(login, password);

    if (result) {
        res.send({ "status": "success", "result": result });
    } else {
        res.send({ "status": "error", "result": result });
    }
});

app.post("/api/user/verification", jsonParser, function(req, res) {
    var uid = req.body.uid;

    var result = authorization.verifyUser(uid);

    if (result) {
        res.send({ "status": "success", "result": result });
    } else {
        res.send({ "status": "error", "result": result });
    }
});

app.post("/api/model/uploading", jsonParser, function(req, res) {
    var bpmnModel = req.body.model;
    var fileName = req.body.file;
    var userId = req.body.uid;

    uploading.uploadModel(bpmnModel, fileName, userId);

    res.send(querying.getAllModels());
});

app.get("/api/model/querying/all/:uid", function(req, res) {
    var uid = req.params.uid;

    res.send(querying.getAllModelsByUserId(uid));
});

app.listen(3000, function() {
    console.log("Gateway is started...");
});