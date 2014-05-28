(function (window, document) {
    'use strict';

    /*
     * Get the party started
     */
    function init () {
        var socket = io();
        var engine = new AudioEngine();
        var ui = new AudioInterface(engine);

        socket.on('connect', function () {
            var id = document.getElementById('synth-id').innerHTML;
            socket.emit('room', id);

            socket.on('filterStart', function (data) {
                engine.getFilterValuesFromTouch(data.x, data.y);
                ui.updateFilter();
            });

            socket.on('filterMove', function (data) {
                engine.getFilterValuesFromTouch(data.x, data.y);
                ui.updateFilter();
            });

            socket.on('clientSize', function (data) {
                engine.setOptions(data);
            });

            socket.on('disconnect', function () {
                //console.log('disconnected');
            });
        });
    }

    window.addEventListener('DOMContentLoaded', init, false);

}(window, document));
