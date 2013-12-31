(function (window, document) {
    'use strict';

    function DualOscillator (context, wave1, wave2) {
        this.osc1 = context.createOscillator();
        this.osc2 = context.createOscillator();
        this.setOsc1Wave(wave1);
        this.setOsc2Wave(wave2);
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

    DualOscillator.prototype.setOsc1Wave = function (wave) {
        this.osc1.type = wave;
    };

    DualOscillator.prototype.setOsc2Wave = function (wave) {
        this.osc2.type = wave;
    };

    DualOscillator.prototype.setOsc1Detune = function (cents) {
        this.osc1.detune.value = cents;
    };

    DualOscillator.prototype.setOsc2Detune = function (cents) {
        this.osc2.detune.value = cents;
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
