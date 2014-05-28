(function (window, document) {
    'use strict';

    function init () {
        var socket = io();
        var filterPad = document.getElementById('filter');
        var roomId = prompt('Enter synth ID to connect touch control');

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

        socket.on('connect', function() {
            socket.emit('room', roomId);
            clientSize();

            socket.on('disconnect', function () {
                //console.log('disconnected');
            });
        });

    }

    window.addEventListener('DOMContentLoaded', init, false);

}(window, document));
