const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');

const app = express();
const jsonParser = bodyParser.json();

const authorization = require('./user/authorization');
const uploading = require('./model/uploading');
const querying = require('./model/querying');
const registration = require('./user/registration');
const assessment = require('./quality/assessment');
const measurement = require("./quality/measurement");
const reporting = require("./quality/reporting");

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

app.post("/api/user/registration", jsonParser, function(req, res) {
    var login = req.body.login;
    var password = req.body.password;
    var role = req.body.role;
    var master = req.body.master;

    res.send(registration.createUser(login, password, role, master));
});

app.get("/api/user/registration/all/:master", function(req, res) {
    var master = req.params.master;

    res.send(registration.getAllUsersByMaster(master));
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

app.get("/api/model/querying/features/:uid", function(req, res) {
    var uid = req.params.uid;

    res.send(querying.getAllModelFeatures(uid));
});

app.post("/api/quality/assessment", jsonParser, function(req, res) {
    var process = req.body.process;
    var measures = req.body.measures;
    var uid = req.body.uid;
    var raw = req.body.raw;
    var file = req.body.file;

    var metadata = req.body.metadata;

    var discrete = measurement.calculateDiscreteCriteria(measures);
    var continuous = measurement.calculateContinuousCriteria(measures);

    var report = assessment.assessQuality(discrete, continuous);

    report["process"] = process;
    report.measures["initial"] = measures;
    report["uid"] = uid;
    report["raw"] = raw;
    report["file"] = file;

    reporting.saveReport(report);

    uploading.uploadModelFeatures(raw, file, uid, metadata, report);

    res.send(report);
});

app.get("/api/reporting/:uid", function(req, res) {
    var uid = req.params.uid;

    res.send(reporting.getAllReports(uid));
});

app.get("/api/reporting/get/:id", function(req, res) {
    var id = req.params.id;

    res.send(reporting.getReportById(id));
});

const PORT = process.env.PORT || 5000;

app
    .use(express.static(path.join(__dirname, 'public')))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));