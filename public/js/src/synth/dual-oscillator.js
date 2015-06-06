class DualOscillator {

    constructor(ctx) {
        this.osc1 = ctx.createOscillator();
        this.osc2 = ctx.createOscillator();
    }

    connect(output) {
        this.osc1.connect(output);
        this.osc2.connect(output);
    }

    setFreq(freq) {
        let f = parseFloat(freq);
        this.osc1.frequency.value = f;
        this.osc2.frequency.value = f;
    }

    setOscWave(options) {
        if (options.wave1) {
            this.osc1.type = options.wave1;
        }
        if (options.wave2) {
            this.osc2.type = options.wave2;
        }
    }

    setOsc1Wave(wave) {
        this.osc1.type = wave;
    }

    setOsc2Wave(wave) {
        this.osc2.type = wave;
    }

    setOscDetune(options) {
        if (options.osc1) {
            this.osc1.detune.value = options.osc1;
        }
        if (options.osc2) {
            this.osc2.detune.value = options.osc2;
        }
    }

    setOsc1Detune(cents) {
        this.osc1.detune.value = cents;
    }

    setOsc2Detune(cents) {
        this.osc2.detune.value = cents;
    }

    start(time) {
        this.osc1.start(time);
        this.osc2.start(time);
    }

    stop(time) {
        this.osc1.stop(time);
        this.osc2.stop(time);
    }
}

export default DualOscillator;
