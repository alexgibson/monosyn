(function (window, document) {
    'use strict';
    /*
     * AudioInterface constructor
     * Create an AudioContext & initialize master output
     */
    function AudioInterface () {
        this.ctx = new AudioContext();
        this.nodes = {};
        this.output = this.initMasterOut();
        this.remoteWidth = null;
        this.remoteHeight = null;
        this.env = {
            attack: 0,
            release: 0
        };
    }

    /*
     * Set the source frequency and gain value on key down
     */
    AudioInterface.prototype.keyDown = function (vel) {
        var now = this.ctx.currentTime;
        this.nodes.oscGain.gain.cancelScheduledValues(now);
        this.nodes.oscGain.gain.setValueAtTime(0, now);
        this.nodes.oscGain.gain.linearRampToValueAtTime(1, now + this.env.attack);
    };

    /*
     * Set the source frequency and gain value on key move
     */
    AudioInterface.prototype.keyMove = function (vel) {
        this.nodes.oscGain.gain.value = vel;
    };

    /*
     * Mute the source gain value on key up
     */
    AudioInterface.prototype.keyUp = function () {
        var now = this.ctx.currentTime;
        this.nodes.oscGain.gain.cancelScheduledValues(now);
        this.nodes.oscGain.gain.setValueAtTime(1, now);
        this.nodes.oscGain.gain.linearRampToValueAtTime(0, now + this.env.release);
    };

    /*
     * Creates a source oscillator with it's own gain control.
     * Sets a default wave type with muted gain value.
     */
    AudioInterface.prototype.initOscillator = function (wave1, wave2) {
        this.nodes.osc1 = this.ctx.createOscillator();
        this.nodes.osc2 = this.ctx.createOscillator();
        this.nodes.oscGain = this.ctx.createGain();
        this.setOsc1Wave(wave1);
        this.setOsc2Wave(wave2);
        this.nodes.oscGain.gain.value = 0;
    };

    /*
     * Set the source oscillator 1 wave type value
     */
    AudioInterface.prototype.setOsc1Wave = function (wave) {
        this.nodes.osc1.type = wave;
    };

    /*
     * Set the source oscillator 2 wave type value
     */
    AudioInterface.prototype.setOsc2Wave = function (wave) {
        this.nodes.osc2.type = wave;
    };

    /*
     * Set the source oscillator 1 detune value
     */
    AudioInterface.prototype.setOsc1Detune = function (wave) {
        this.nodes.osc1.detune.value = wave;
    };

    /*
     * Set the source oscillator 2 detune value
     */
    AudioInterface.prototype.setOsc2Detune = function (wave) {
        this.nodes.osc2.detune.value = wave;
    };

    /*
     * Creates a biquad filter and set default values
     */
    AudioInterface.prototype.initBiquadFilter = function (type) {
        this.nodes.filter = this.ctx.createBiquadFilter();
        this.setFilterType(type);
        this.setFilterFreq(12000);
        this.setFilterQuality(1);
    };

    /*
     * Set the source oscillator frequency values
     */
    AudioInterface.prototype.setOscFreq = function (freq) {
        this.nodes.osc1.frequency.value = freq;
        this.nodes.osc2.frequency.value = freq;
    };

    /*
     * Get the filter frequency and q values based on touch coordinates
     */
    AudioInterface.prototype.getTouchFreq = function (x, y) {
        var freq = 12000 - (parseInt(y, 10) * (12000 / this.remoteHeight));
        var q = 10 - (this.remoteWidth - parseInt(x, 10)) / this.remoteWidth * 10;
        freq = Math.min(freq, 12000);
        freq = Math.max(40, freq);
        q = Math.min(q, 10);
        q = Math.max(1, q);
        this.setFilterQuality(Math.round(q));
        this.setFilterFreq(Math.round(freq));
    };

    AudioInterface.prototype.getFilterType = function (type) {
        return this.nodes.filter.type;
    };

    AudioInterface.prototype.setFilterType = function (type) {
        this.nodes.filter.type = type;
    };

    AudioInterface.prototype.setFilterFreq = function (freq) {
        this.nodes.filter.frequency.value = freq;
    };

    AudioInterface.prototype.getFilterFreq = function () {
        return this.nodes.filter.frequency.value;
    };

    AudioInterface.prototype.getFilterQuality = function () {
        return this.nodes.filter.Q.value;
    };

    AudioInterface.prototype.setFilterQuality = function (q) {
        this.nodes.filter.Q.value = q;
    };

    AudioInterface.prototype.setEnvAttack = function (time) {
        this.env.attack = parseFloat(time);
    };

    AudioInterface.prototype.setEnvRelease = function (time) {
        this.env.release = parseFloat(time);
    };

    AudioInterface.prototype.routeComponents = function (out) {
        this.nodes.osc1.connect(this.nodes.filter);
        this.nodes.osc2.connect(this.nodes.filter);
        this.nodes.filter.connect(this.nodes.oscGain);
        this.nodes.oscGain.connect(this.output);
        this.nodes.osc1.start(0);
        this.nodes.osc2.start(0);
    };

    /*
     * Master output component consists of a dynamics compressor
     * and volume gain mapped to the AudioContext destination.
     */
    AudioInterface.prototype.initMasterOut = function () {
        this.nodes.masterComp = this.ctx.createDynamicsCompressor();
        this.nodes.masterGain = this.ctx.createGain();
        this.nodes.masterGain.gain.value = 0.9;
        this.nodes.masterComp.connect(this.nodes.masterGain);
        this.nodes.masterGain.connect(this.ctx.destination);
        return this.nodes.masterComp;
    };

    /*
     * Holy sh*t stop the noise already!
     */
    AudioInterface.prototype.kill = function () {
        this.nodes.osc1.stop(0);
        this.nodes.osc2.stop(0);
        this.nodes.masterGain.disconnect(this.ctx.destination);
    };

    AudioInterface.prototype.setRemoteInputSize = function (data) {
        this.remoteWidth = data.x;
        this.remoteHeight = data.y;
    };

    window.AudioInterface = AudioInterface;

}(window, document));
