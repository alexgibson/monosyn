window.addEventListener('DOMContentLoaded', () => {

    let socket = io();
    let filterPad = document.getElementById('filter');
    let roomId = prompt('Enter synth ID to connect touch control');

    if (!roomId) {
        return;
    }

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
            remoteWidth: filterPad.clientWidth,
            remoteHeight: filterPad.clientHeight,
            room: roomId
        });
    }

    socket.on('connect', () => {
        socket.emit('room', roomId);
        clientSize();

        socket.on('disconnect', () => {
            //console.log('disconnected');
        });
    });
});
