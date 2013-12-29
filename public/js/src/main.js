(function (window, document) {
    'use strict';
    /*
     * Creates a random room id
     */
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
        var socket = io.connect(window.location.protocol + window.location.hostname);
        var synth = new AudioInterface();
        var ui = new UI(synth);
        var roomId = createRoomId();

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

        document.getElementById('room').innerHTML = roomId;
    }

    window.addEventListener('DOMContentLoaded', init, false);

}(window, document));
