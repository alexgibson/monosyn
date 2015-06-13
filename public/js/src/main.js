import React from 'react';
import Monosyn from './components/monosyn';
import config from './synth/config';

window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    React.render(
        <Monosyn data={config} />,
        document.getElementById('monosyn')
    );
});
