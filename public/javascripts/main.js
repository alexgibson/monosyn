function createRoomId() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 8;
    var randomstring = '';
    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
    }
    return randomstring;
}

/*
 * Get the party started
 */
function init () {
    'use strict';
    var socket = io.connect(window.location.protocol + window.location.hostname + ':8008');
    var synth = new AudioInterface();
    var ui = new UI(synth);
    var roomId = createRoomId();
    var roomURL = window.location.href + '?id=' + roomId;
    var remoteLink = document.getElementById('remote-url');

    socket.on('filterStart', function(data) {
        synth.getTouchFreq(data.x, data.y);
        ui.updateFilter();
    });

    socket.on('filterMove', function(data) {
        synth.getTouchFreq(data.x, data.y);
        ui.updateFilter();
    });

    socket.on('clientSize', function(data) {
        synth.setRemoteInputSize(data);
    });

    socket.on('connect', function() {
        socket.emit('room', roomId);
    });

    remoteLink.innerHTML = roomURL;
    remoteLink.setAttribute('href', roomURL);
}

window.addEventListener('DOMContentLoaded', init, false);
