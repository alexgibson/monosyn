import React from 'react';
import io from 'socket.io-client';
import Monosyn from './components/monosyn';
import AudioEngine from './synth/engine';
import config from './synth/config';

window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    let engine = new AudioEngine();
    let socket = io();

    React.render(
      <Monosyn data={config} />,
      document.getElementById('monosyn')
    );

    socket.on('connect', () => {
        let id = document.getElementById('synth-id').innerHTML;
        socket.emit('room', id);

        socket.on('clientSize', (data) => {
            engine.setOptions(data);
        });

        socket.on('disconnect', () => {
            Monosyn.setState({
                status: 'disconnected'
            });
        });

        socket.on('remoteConnected', (data) => {
            Monosyn.setState({
                status: 'connected'
            });
        });

        socket.on('filterStart', (data) => {
            engine.getFilterValuesFromTouch(data.x, data.y);
            Monosyn.setState({
                freq: engine.getFilterFreq(),
                q: engine.getFilterQuality()
            });
        });

        socket.on('filterMove', (data) => {
            engine.getFilterValuesFromTouch(data.x, data.y);
            Monosyn.setState({
                freq: engine.getFilterFreq(),
                q: engine.getFilterQuality()
            });
        });
    });
});
