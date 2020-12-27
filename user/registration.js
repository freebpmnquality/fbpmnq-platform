var md5 = require('js-md5');
var fs = require("fs");

function getAllUsers() {
    var content = fs.readFileSync("./user/database.json", "utf8");
    var users = JSON.parse(content);

    return users;
}

function getAllUsersByMaster(master) {
    var content = fs.readFileSync("./user/database.json", "utf8");
    var users = JSON.parse(content);

    var results = [];

    for (var i = 0; i < users.length; i++) {
        if (users[i].master === master) {
            results.push(users[i]);
        }
    }

    return results;
}

function createUser(login, password, role, master) {
    var content = fs.readFileSync("./user/database.json", "utf8");
    var users = JSON.parse(content);

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

    users.push(user);

    var data = JSON.stringify(users);
    fs.writeFileSync("./user/database.json", data);

    return { "status": "created" };
}

module.exports.getAllUsers = getAllUsers;
module.exports.createUser = createUser;
module.exports.getAllUsersByMaster = getAllUsersByMaster;