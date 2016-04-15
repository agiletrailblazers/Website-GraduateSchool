// session timer
var timerId;
var timeLimit;
var startTime;

$(document).ready(function () {

    // register an event listener on the session timeout modal
    $('#sessionTimeoutModal').on('hide.bs.modal', function (e) {
        // session timeout modal dismissed, redirect logged out user to the homepage
        window.location = "/";
    });

    // set the browser side timeout just slightly ahead (30 seconds) of the server session, this way
    // the logout call will clean up the session immediately as opposed to waiting for it to get cleaned up.
    timeLimit = ($("#sessionTimeout").val() - 30000);

    // only start monitoring on page load if an authenticated session
    if ($("#userId").val()) {
        // start session monitor
        startSessionMonitor();
    }
});

function checkSession() {

    var currentTime = (new Date()).getTime();

    if ((currentTime - startTime) >= timeLimit) {
        stopSessionMonitor();

        // log the user out
        $.post("/manage/user/logout")
            .done(function () {
                // user has been logged out, display the session timeout modal
                $('#sessionTimeoutModal').modal('show');
            });
    }
    else {
        // check the session time every 15 seconds
        timerId = setTimeout(checkSession, 15000);
    }
}

function startSessionMonitor() {

    // this may be called from a modal login (outside of a page load), make sure in a known clean
    // starting state by stopping any monitor that might be already running
    stopSessionMonitor();

    // now start monitoring
    startTime = (new Date()).getTime();
    checkSession();
}

function stopSessionMonitor() {

    if (timerId != null) {
        clearTimeout(timerId);
        timerId = null;
        startTime = null;
    }
}