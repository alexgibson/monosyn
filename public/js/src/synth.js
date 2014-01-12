(function (window, document) {
    'use strict';
    /*
     * AudioInterface constructor
     * Create an AudioContext & initialize master output
     */
    function AudioInterface () {
        this.ctx = new AudioContext();
        this.nodes = {};
        this.remoteWidth = null;
        this.remoteHeight = null;
        this.env = {
            attack: 0,
            release: 0
        };
        this.initComponents();
        this.routeComponents();
    }

    AudioInterface.prototype.initComponents = function () {
        this.nodes.osc = new DualOscillator(this.ctx);
        this.nodes.oscGain = this.ctx.createGain();
        this.nodes.oscGain.gain.value = 0;
        this.nodes.filter = this.ctx.createBiquadFilter();
        this.nodes.masterComp = this.ctx.createDynamicsCompressor();
        this.nodes.masterGain = this.ctx.createGain();
        this.nodes.masterGain.gain.value = 0.9;
    };

    AudioInterface.prototype.routeComponents = function (out) {
        this.nodes.osc.connect(this.nodes.filter);
        this.nodes.filter.connect(this.nodes.oscGain);
        this.nodes.oscGain.connect(this.nodes.masterComp);
        this.nodes.masterComp.connect(this.nodes.masterGain);
        this.nodes.masterGain.connect(this.ctx.destination);
        this.nodes.osc.start(0);
    };

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
    AudioInterface.prototype.keyMove = function (val) {
        this.nodes.oscGain.gain.value = val;
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

    AudioInterface.prototype.getFreqFromNote = function (note) {
        return 440 * Math.pow(2, (note - 49) / 12);
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

    /*
     * Holy sh*t stop the noise already!
     */
    AudioInterface.prototype.kill = function () {
        this.nodes.osc.stop(0);
        this.nodes.masterGain.disconnect(this.ctx.destination);
    };

    AudioInterface.prototype.setRemoteInputSize = function (data) {
        this.remoteWidth = data.x;
        this.remoteHeight = data.y;
    };

    AudioInterface.prototype.loadPreset = function (options) {
        this.nodes.osc.setOscWave({
            wave1: options.osc1Wave,
            wave2: options.osc2Wave
        });
        this.nodes.osc.setOscDetune({
            osc1: options.osc1Detune,
            osc2: options.osc2Detune
        });

        this.setFilterType(options.filterType);
        this.setFilterFreq(options.filterFreq);
        this.setFilterQuality(options.filterQuality);
        this.setEnvAttack(options.envAttack);
        this.setEnvRelease(options.envRelease);
    };

    AudioInterface.prototype.osc = function () {
        return this.nodes.osc;
    };

    window.AudioInterface = AudioInterface;

}(window, document));
