var fs = require("fs");

function checkUser(login, password) {
    var content = fs.readFileSync("./user/database.json", "utf8");
    var users = JSON.parse(content);
    var user = null;

    for (var i = 0; i < users.length; i++) {
        if (users[i].login === login && users[i].password === password) {
            user = users[i];
            break;
        }
    }

    return user;
}

function verifyUser(uid) {
    var content = fs.readFileSync("./user/database.json", "utf8");
    var users = JSON.parse(content);
    var user = null;

    for (var i = 0; i < users.length; i++) {
        if (users[i].uid === uid) {
            user = users[i];
            break;
        }
    }

    return user;
}

module.exports.checkUser = checkUser;
module.exports.verifyUser = verifyUser;