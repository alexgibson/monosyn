const config = {
    'waves': [
        'sine',
        'square',
        'sawtooth',
        'triangle'
    ],
    'filters': [
        'lowpass',
        'highpass',
        'bandpass',
        'lowshelf',
        'highshelf',
        'peaking',
        'notch',
        'allpass'
    ],
    'osc1': {
        'wave': 'square',
        'detune': -6,
        'minDetune': -50,
        'maxDetune': 50,
        'ref': 'osc1',
        'detuneId': 'osc-1-detune'
    },
    'osc2': {
        'wave': 'sawtooth',
        'detune': -10,
        'minDetune': -50,
        'maxDetune': 50,
        'ref': 'osc2',
        'detuneId': 'osc-2-detune'
    },
    'filter': {
        'type': 'lowpass',
        'minFreq': 40,
        'maxFreq': 12000,
        'freq': 12000,
        'minQ': 1,
        'maxQ': 10,
        'q': 1
    },
    'env': {
        'attack': 0.1,
        'release': 0.2,
        'min': 0,
        'max': 2.0,
        'step': 0.1
    },
    'keys': [
        {
            'note': 4,
            'cls': 'white'
        },
        {
            'note': 5,
            'cls': 'black'
        },
        {
            'note': 6,
            'cls': 'white'
        },
        {
            'note': 7,
            'cls': 'black'
        },
        {
            'note': 8,
            'cls': 'white'
        },
        {
            'note': 9,
            'cls': 'white'
        },
        {
            'note': 10,
            'cls': 'black'
        },
        {
            'note': 11,
            'cls': 'white'
        },
        {
            'note': 12,
            'cls': 'black'
        },
        {
            'note': 13,
            'cls': 'white'
        },
        {
            'note': 14,
            'cls': 'black'
        },
        {
            'note': 15,
            'cls': 'white'
        },
        {
            'note': 16,
            'cls': 'white'
        },
        {
            'note': 17,
            'cls': 'black'
        },
        {
            'note': 18,
            'cls': 'white'
        },
        {
            'note': 19,
            'cls': 'black'
        },
        {
            'note': 20,
            'cls': 'white'
        },
        {
            'note': 21,
            'cls': 'white'
        },
        {
            'note': 22,
            'cls': 'black'
        },
        {
            'note': 23,
            'cls': 'white'
        },
        {
            'note': 24,
            'cls': 'black'
        },
        {
            'note': 25,
            'cls': 'white'
        },
        {
            'note': 26,
            'cls': 'black'
        },
        {
            'note': 27,
            'cls': 'white'
        },
        {
            'note': 28,
            'cls': 'white'
        },
        {
            'note': 29,
            'cls': 'black'
        },
        {
            'note': 30,
            'cls': 'white'
        },
        {
            'note': 31,
            'cls': 'black'
        },
        {
            'note': 32,
            'cls': 'white'
        },
        {
            'note': 33,
            'cls': 'white'
        },
        {
            'note': 34,
            'cls': 'black'
        },
        {
            'note': 35,
            'cls': 'white'
        },
        {
            'note': 36,
            'cls': 'black'
        },
        {
            'note': 37,
            'cls': 'white'
        },
        {
            'note': 38,
            'cls': 'black'
        },
        {
            'note': 39,
            'cls': 'white'
        },
        {
            'note': 40,
            'cls': 'white'
        },
        {
            'note': 41,
            'cls': 'black'
        },
        {
            'note': 42,
            'cls': 'white'
        },
        {
            'note': 43,
            'cls': 'black'
        },
        {
            'note': 44,
            'cls': 'white'
        },
        {
            'note': 45,
            'cls': 'white'
        },
        {
            'note': 46,
            'cls': 'black'
        },
        {
            'note': 47,
            'cls': 'white'
        },
        {
            'note': 48,
            'cls': 'black'
        },
        {
            'note': 49,
            'cls': 'white'
        },
        {
            'note': 50,
            'cls': 'black'
        },
        {
            'note': 51,
            'cls': 'white'
        }
    ],
    chars: {
        'z': 16,
        's': 17,
        'x': 18,
        'd': 19,
        'c': 20,
        'v': 21,
        'g': 22,
        'b': 23,
        'h': 24,
        'n': 25,
        'j': 26,
        'm': 27
    }
};

export default config;
