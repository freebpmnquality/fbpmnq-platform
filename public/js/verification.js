var uid = getParameterByName("uid");

$.ajax({
    url: "api/user/verification",
    contentType: "application/json",
    method: "POST",
    data: JSON.stringify({
        uid: uid
    }),
    success: function(user) {
        if (user.status === "success") {
            $("#userLogin").text(user.result.login);
        } else {
            window.location.href = "./";
        }
    }
})

if (uid === undefined || uid === null) {
    window.location.href = "./";
}

function openVerifiedPage(page) {
    window.location.href = "./" + page + "?uid=" + uid;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;

    name = name.replace(/[\[\]]/g, '\\$&');

    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);

    if (!results) return null;
    if (!results[2]) return '';

    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}