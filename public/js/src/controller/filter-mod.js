import io from 'socket.io-client';

window.addEventListener('DOMContentLoaded', () => {

    let socket = io();
    let filterPad = document.getElementById('filter');
    let roomId = window.location.hash.substring(1);

    if (!roomId) {
        return;
    }

    filterPad.addEventListener('touchstart', onTouchStart, false);
    filterPad.addEventListener('touchmove', onTouchMove, false);
    filterPad.addEventListener('touchend', onTouchEnd, false);

    function onTouchStart(e) {
        e.preventDefault();
        socket.emit('touchstart', {
            x: e.touches[0].clientX ,
            y: e.touches[0].clientY,
            room: roomId
        });
    }

    function onTouchMove(e) {
        e.preventDefault();
        socket.emit('touchmove', {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            room: roomId
        });
    }

    function onTouchEnd(e) {
        e.preventDefault();
        if (e.touches.length === 0) {
            socket.emit('touchend', {
                room: roomId
            });
        }
    }

    function onResize() {
        socket.emit('resize', {
            remoteWidth: filterPad.clientWidth,
            remoteHeight: filterPad.clientHeight,
            room: roomId
        });
    }

    socket.on('connect', () => {
        socket.emit('room', roomId);
        onResize();

        socket.emit('status', {
            connection: 'connected',
            room: roomId
        });

        socket.on('disconnect', () => {
            socket.emit('status', {
                connection: 'disconnected',
                room: roomId
            });
        });
    });
});
