const StormDB = require("stormdb");

const engine = new StormDB.localFileEngine("./user/user.json");
const db = new StormDB(engine);

function checkUser(login, password) {
    var users = db.get("users").value();
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
    var users = db.get("users").value();
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