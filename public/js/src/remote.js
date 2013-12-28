function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function init () {
    var socket = io.connect(window.location.protocol + window.location.hostname);

    var filterPad = document.getElementById('filter');
    var urlVars = getUrlVars();
    var roomId = urlVars.id;

    filterPad.addEventListener('touchstart', filterStart, false);
    filterPad.addEventListener('touchmove', filterMove, false);
    filterPad.addEventListener('touchend', filterEnd, false);

    function filterStart (e) {
        e.preventDefault();
        socket.emit('remoteFilterStart', {
            x: e.touches[0].clientX ,
            y: e.touches[0].clientY,
            room: roomId
        });
    }

    function filterMove (e) {
        e.preventDefault();
        socket.emit('remoteFilterMove', {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            room: roomId
        });
    }

    function filterEnd (e) {
        e.preventDefault();
        if (e.touches.length === 0) {
            socket.emit('remoteFilterEnd', {
                room: roomId
            });
        }
    }

    function clientSize () {
        socket.emit('remoteClientSize', {
            x: filterPad.clientWidth,
            y: filterPad.clientHeight,
            room: roomId
        });
    }

    socket.on('connect', function() {
        socket.emit('room', roomId);
        clientSize();
    });

}

window.addEventListener('DOMContentLoaded', init, false);


