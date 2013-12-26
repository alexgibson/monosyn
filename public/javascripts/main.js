/*
 * Get the party started
 */
function init () {
    'use strict';
    var socket = io.connect(window.location.protocol + window.location.hostname + ':8008');
    var synth = new AudioInterface();
    var ui = new UI(synth);

    socket.on('filterStart', (data) => {
        synth.getTouchFreq(data.x, data.y);
        ui.updateFilter();
    });

    socket.on('filterMove', (data) => {
        synth.getTouchFreq(data.x, data.y);
        ui.updateFilter();
    });

    socket.on('clientSize', (data) => {
        synth.setRemoteInputSize(data);
    });
}

window.addEventListener('DOMContentLoaded', init, false);
