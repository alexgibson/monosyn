(function (window, document) {
    'use strict';
    /*
     * AudioEngine constructor
     * Creates an AudioContext & routes components
     */
    function AudioEngine () {
        this.ctx = new AudioContext();
        this.nodes = {};
        this.options = {
            osc1Wave: 'sine',
            osc2Wave: 'sine',
            osc1Detune: 0,
            osc2Detune: 0,
            filterType: 'lowpass',
            filterFreq: 12000,
            filterQuality: 1,
            attack: 0,
            release: 0,
            keys: 49,
            remoteWidth: null,
            remoteHeight: null

        };

        this.initComponents();
        this.routeComponents();

        // create a new synth ID to use for remote connection
        this.id = this.createId();
    }

    /*
     * Creates audio nodes
     */
    AudioEngine.prototype.initComponents = function () {
        this.nodes.osc = new DualOscillator(this.ctx);
        this.nodes.oscGain = this.ctx.createGain();
        this.nodes.oscGain.gain.value = 0;
        this.nodes.filter = this.ctx.createBiquadFilter();
        this.nodes.masterComp = this.ctx.createDynamicsCompressor();
        this.nodes.masterGain = this.ctx.createGain();
        this.nodes.masterGain.gain.value = 0.9;
    };

    /*
     * Routes audio nodes starting with source (oscillator)
     * and finishing with destinations (speakers)
     */
    AudioEngine.prototype.routeComponents = function (out) {
        this.nodes.osc.connect(this.nodes.filter);
        this.nodes.filter.connect(this.nodes.oscGain);
        this.nodes.oscGain.connect(this.nodes.masterComp);
        this.nodes.masterComp.connect(this.nodes.masterGain);
        this.nodes.masterGain.connect(this.ctx.destination);
        this.nodes.osc.start(0);
    };

    /*
     * Generates an id for each synth instance to be used for remote communication
     */
    AudioEngine.prototype.createId = function () {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var length = 8;
        var randomstring = '';
        for (var i = 0; i < length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum+1);
        }
        return randomstring;
    };

    /*
     * Set the source frequency and gain value on key down
     */
    AudioEngine.prototype.noteStart = function (vel) {
        var now = this.ctx.currentTime;
        this.nodes.oscGain.gain.cancelScheduledValues(now);
        this.nodes.oscGain.gain.setValueAtTime(0, now);
        this.nodes.oscGain.gain.linearRampToValueAtTime(1, now + this.options.attack);
    };

    /*
     * Set the source frequency and gain value on key move
     */
    AudioEngine.prototype.noteMove = function (val) {
        this.nodes.oscGain.gain.value = val;
    };

    /*
     * Mute the source gain value on key up
     */
    AudioEngine.prototype.noteEnd = function () {
        var now = this.ctx.currentTime;
        this.nodes.oscGain.gain.cancelScheduledValues(now);
        this.nodes.oscGain.gain.setValueAtTime(1, now);
        this.nodes.oscGain.gain.linearRampToValueAtTime(0, now + this.options.release);
    };

    /*
     * Get the filter frequency and q values based on touch coordinates
     * @param x (number), y (number)
     */
    AudioEngine.prototype.getFilterValuesFromTouch = function (x, y) {
        var freq = 12000 - (parseInt(y, 10) * (12000 / this.options.remoteHeight));
        var q = 10 - (this.options.remoteWidth - parseInt(x, 10)) / this.options.remoteWidth * 10;
        freq = Math.min(freq, 12000);
        freq = Math.max(40, freq);
        q = Math.min(q, 10);
        q = Math.max(1, q);
        this.setFilterQuality(Math.round(q));
        this.setFilterFreq(Math.round(freq));
    };

    /*
     * Returns the oscillator frequency for a given piano key number
     * @param note (number)
     * @return frequency (number)
     */
    AudioEngine.prototype.getFreqFromNote = function (note) {
        return 440 * Math.pow(2, (note - this.options.keys) / 12);
    };

    AudioEngine.prototype.getFilterType = function (type) {
        return this.nodes.filter.type;
    };

    AudioEngine.prototype.setFilterType = function (type) {
        this.nodes.filter.type = type;
    };

    AudioEngine.prototype.setFilterFreq = function (freq) {
        this.nodes.filter.frequency.value = freq;
    };

    AudioEngine.prototype.getFilterFreq = function () {
        return this.nodes.filter.frequency.value;
    };

    AudioEngine.prototype.getFilterQuality = function () {
        return this.nodes.filter.Q.value;
    };

    AudioEngine.prototype.setFilterQuality = function (q) {
        this.nodes.filter.Q.value = q;
    };

    AudioEngine.prototype.setEnvAttack = function (time) {
        this.options.attack = parseFloat(time);
    };

    AudioEngine.prototype.setEnvRelease = function (time) {
        this.options.release = parseFloat(time);
    };

    /*
     * Updates remote control input width and height values
     * @param options (object)
     */
    AudioEngine.prototype.setRemoteInputSize = function (options) {
        if (typeof options === 'object') {
            for (var i in options) {
                if (options.hasOwnProperty(i)) {
                    this.options[i] = options[i];
                }
            }
        }
    };

    /*
     * Loads a set of synth engine preset values
     * @param options (object)
     */
    AudioEngine.prototype.loadPreset = function (options) {
        if (typeof options === 'object') {
            for (var i in options) {
                if (options.hasOwnProperty(i)) {
                    this.options[i] = options[i];
                }
            }

            this.nodes.osc.setOscWave({
                wave1: this.options.osc1Wave,
                wave2: this.options.osc2Wave
            });
            this.nodes.osc.setOscDetune({
                osc1: this.options.osc1Detune,
                osc2: this.options.osc2Detune
            });

            this.setFilterType(this.options.filterType);
            this.setFilterFreq(this.options.filterFreq);
            this.setFilterQuality(this.options.filterQuality);
            this.setEnvAttack(this.options.envAttack);
            this.setEnvRelease(this.options.envRelease);
        }
    };

    /*
     * Returns a reference to the source oscillator node
     */
    AudioEngine.prototype.getSource = function () {
        return this.nodes.osc;
    };

    /*
     * Returns the synth engine ID used for remote connection
     */
    AudioEngine.prototype.getId = function () {
        return this.id;
    };

    window.AudioEngine = AudioEngine;

}(window, document));
