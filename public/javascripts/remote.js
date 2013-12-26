function init () {
    var socket = io.connect(window.location.protocol + window.location.hostname + ":8008");

    var filterPad = document.getElementById('filter');

    filterPad.addEventListener('touchstart', filterStart, false);
    filterPad.addEventListener('touchmove', filterMove, false);
    filterPad.addEventListener('touchend', filterEnd, false);

    function filterStart (e) {
        e.preventDefault();
        socket.emit('remoteFilterStart', {
            x: e.touches[0].clientX ,
            y: e.touches[0].clientY
        });
    }

    function filterMove (e) {
        e.preventDefault();
        socket.emit('remoteFilterMove', {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        });
    }

    function filterEnd (e) {
        e.preventDefault();
        if (e.touches.length === 0) {
            socket.emit('remoteFilterEnd', {});
        }
    }

    function clientSize () {
        socket.emit('remoteClientSize', {
            x: filterPad.clientWidth,
            y: filterPad.clientHeight
        });
    }

    socket.on('connect', clientSize);

}

window.addEventListener('DOMContentLoaded', init, false);


