(function (window, document) {
    'use strict';

    function AudioInterface (engine) {
        var doc = document;
        this.osc1 = doc.getElementById('osc-1');
        this.osc2 = doc.getElementById('osc-2');
        this.osc1Detune = doc.getElementById('osc-1-detune');
        this.osc2Detune = doc.getElementById('osc-2-detune');
        this.osc1DetuneOutput = doc.getElementById('osc-1-detune-output');
        this.osc2DetuneOutput = doc.getElementById('osc-2-detune-output');
        this.filterType = doc.getElementById('filter-type');
        this.filterFreq = doc.getElementById('filter-freq');
        this.filterQuality = doc.getElementById('filter-q');
        this.filterFreqOutput = doc.getElementById('filter-freq-output');
        this.filterQualityOutput = doc.getElementById('filter-q-output');
        this.envAttack = doc.getElementById('env-attack');
        this.envRelease = doc.getElementById('env-release');
        this.envAttackOutput = doc.getElementById('env-attack-output');
        this.envReleaseOutput = doc.getElementById('env-release-output');
        this.keyboard = doc.getElementById('keyboard');
        this.synthId = doc.getElementById('synth-id');

        if (!engine || !engine instanceof AudioEngine) {
            throw new Error('AudioInterface() first arg must be instance of AudioEngine');
        }

        this.engine = engine;

        this.noteDown = false;
        this.currentNote = null;

        this.osc = this.engine.getSource();

        this.options = {
            osc1Wave: this.osc1.options[this.osc1.selectedIndex].value,
            osc2Wave: this.osc2.options[this.osc2.selectedIndex].value,
            osc1Detune: this.osc1Detune.value,
            osc2Detune: this.osc2Detune.value,
            filterType: this.filterType.options[this.filterType.selectedIndex].value,
            filterFreq: this.filterFreq.value,
            filterQuality: this.filterQuality.value,
            envAttack: this.envAttack.value,
            envRelease: this.envRelease.value
        };

        this.engine.loadPreset(this.options);

        this.setOutputDefaults();
        this.bindEvents();
    }

    AudioInterface.prototype.setOutputDefaults = function () {
        this.filterFreqOutput.innerHTML = this.options.filterFreq;
        this.filterQualityOutput.innerHTML = this.options.filterQuality;
        this.osc1DetuneOutput.innerHTML = this.options.osc1Detune;
        this.osc2DetuneOutput.innerHTML = this.options.osc2Detune;
        this.envAttackOutput.innerHTML = this.options.envAttack;
        this.envReleaseOutput.innerHTML = this.options.envRelease;
        this.synthId.innerHTML = this.engine.getId();
    };

    AudioInterface.prototype.bindEvents = function () {
        this.keyboard.addEventListener('mousedown', this.keyDown.bind(this), false);
        this.keyboard.addEventListener('mouseup', this.keyUp.bind(this), false);
        this.keyboard.addEventListener('mouseleave', this.keyUp.bind(this), false);

        this.filterFreq.addEventListener('input', this.onFilterFreqChange.bind(this), false);
        this.filterQuality.addEventListener('input', this.onFilterQualityChange.bind(this), false);
        this.filterType.addEventListener('change', this.onFilterTypeChange.bind(this), false);

        this.osc1.addEventListener('change', this.onOsc1WaveChange.bind(this), false);
        this.osc2.addEventListener('change', this.onOsc2WaveChange.bind(this), false);
        this.osc1Detune.addEventListener('input', this.onOsc1DetuneChange.bind(this), false);
        this.osc2Detune.addEventListener('input', this.onOsc2DetuneChange.bind(this), false);

        this.envAttack.addEventListener('input', this.onEnvAttackChange.bind(this), false);
        this.envRelease.addEventListener('input', this.onEnvReleaseChange.bind(this), false);
    };

    AudioInterface.prototype.onFilterTypeChange = function (e) {
        this.engine.setFilterType(e.target.value);
    };

    AudioInterface.prototype.onFilterFreqChange = function (e) {
        this.engine.setFilterFreq(e.target.value);
        this.filterFreqOutput.innerHTML = e.target.value;
    };

    AudioInterface.prototype.onFilterQualityChange = function (e) {
        this.engine.setFilterQuality(e.target.value);
        this.filterQualityOutput.innerHTML = e.target.value;
    };

    AudioInterface.prototype.onOsc1WaveChange = function (e) {
        this.osc.setOscWave({
            wave1: e.target.value
        });
    };

    AudioInterface.prototype.onOsc2WaveChange = function (e) {
        this.osc.setOscWave({
            wave2: e.target.value
        });
    };

    AudioInterface.prototype.onOsc1DetuneChange = function (e) {
        this.osc.setOscDetune({
            osc1: e.target.value
        });
        this.osc1DetuneOutput.innerHTML = e.target.value;
    };

    AudioInterface.prototype.onOsc2DetuneChange = function (e) {
        this.osc.setOscDetune({
            osc2: e.target.value
        });
        this.osc2DetuneOutput.innerHTML = e.target.value;
    };

    AudioInterface.prototype.onEnvAttackChange = function (e) {
        this.engine.setEnvAttack(e.target.value);
        this.envAttackOutput.innerHTML = e.target.value;
    };

    AudioInterface.prototype.onEnvReleaseChange = function (e) {
        this.engine.setEnvRelease(e.target.value);
        this.envReleaseOutput.innerHTML = e.target.value;
    };

    AudioInterface.prototype.updateFilter = function () {
        var freq = this.engine.getFilterFreq();
        var q = this.engine.getFilterQuality();
        this.filterFreq.value = freq;
        this.filterFreqOutput.innerHTML = freq;
        this.filterQuality.value = q;
        this.filterQualityOutput.innerHTML = q;
    };

    AudioInterface.prototype.keyDown = function (e) {
        var key = document.elementFromPoint(e.clientX, e.clientY);
        var freq = this.engine.getFreqFromNote(key.getAttribute('data-id'));
        e.preventDefault();
        this.noteDown = true;
        this.currentNote = freq;
        this.osc.setFreq(freq);
        this.engine.noteStart();
        this.keyboard.addEventListener('mousemove', this.keyMove.bind(this), false);
    };

    AudioInterface.prototype.keyMove = function (e) {
        var key = document.elementFromPoint(e.clientX, e.clientY);
        var freq = this.engine.getFreqFromNote(key.getAttribute('data-id'));
        e.preventDefault();
        if (this.noteDown && this.currentNote !== freq) {
            this.osc.setFreq(freq);
            this.engine.noteMove(1);
            this.currentNote = freq;
        }
    };

    AudioInterface.prototype.keyUp = function (e) {
        e.preventDefault();
        if (this.noteDown) {
            this.engine.noteEnd();
            this.keyboard.removeEventListener('mousemove', this.keyMove.bind(this), false);
            this.noteDown = false;
            this.currentNote = null;
        }
    };

    window.AudioInterface = AudioInterface;

}(window, document));
