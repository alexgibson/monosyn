(function (window, document) {
    'use strict';

    function DualOscillator (ctx) {
        this.osc1 = ctx.createOscillator();
        this.osc2 = ctx.createOscillator();
    }

    DualOscillator.prototype.connect = function (output) {
        this.osc1.connect(output);
        this.osc2.connect(output);
    };

    DualOscillator.prototype.setFreq = function (freq) {
        var f = parseFloat(freq);
        this.osc1.frequency.value = f;
        this.osc2.frequency.value = f;
    };

    DualOscillator.prototype.setOscWave = function (options) {
        if (options.wave1) {
            this.osc1.type = options.wave1;
        }
        if (options.wave2) {
            this.osc2.type = options.wave2;
        }
    };

    DualOscillator.prototype.setOscDetune = function (options) {
        if (options.osc1) {
            this.osc1.detune.value = options.osc1;
        }
        if (options.osc2) {
            this.osc2.detune.value = options.osc2;
        }
    };

    DualOscillator.prototype.start = function (time) {
        this.osc1.start(time);
        this.osc2.start(time);
    };

    DualOscillator.prototype.stop = function (time) {
        this.osc1.stop(time);
        this.osc2.stop(time);
    };

    window.DualOscillator = DualOscillator;

}(window, document));
