const md5 = require('js-md5');

const StormDB = require("stormdb");

const engine = new StormDB.localFileEngine("./user/user.json");
const db = new StormDB(engine);

function getAllUsers() {
    var users = db.get("users").value();

    return users;
}

function getAllUsersByMaster(master) {
    var users = db.get("users").value();

    var results = [];

    for (var i = 0; i < users.length; i++) {
        if (users[i].master === master) {
            results.push(users[i]);
        }
    }

    return results;
}

function createUser(login, password, role, master) {
    var users = db.get("users").value();

    for (var i = 0; i < users.length; i++) {
        if (users[i].uid === md5(login + password).toString()) {
            return { "status": "exists" };
        }
    }

    var regex = /^([0-9a-zA-Z\_\!]+)$/;

    if (!regex.test(login) || !regex.test(password)) {
        return { "status": "invalid" };
    }

    var user = {
        login: login,
        password: password,
        role: role,
        uid: md5(login + password).toString(),
        master: master,
        timestamp: new Date().toLocaleString()
    };

    db.get("users").push(user);
    db.save();

    return { "status": "created" };
}

module.exports.getAllUsers = getAllUsers;
module.exports.createUser = createUser;
module.exports.getAllUsersByMaster = getAllUsersByMaster;