(function (window, document) {
    'use strict';

    function UI (synth) {
        var doc = document;
        this.synth = synth;
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

        var osc1Wave = this.osc1.options[this.osc1.selectedIndex].value;
        var osc2Wave = this.osc2.options[this.osc2.selectedIndex].value;

        this.synth.initOscillator(osc1Wave, osc2Wave);
        this.synth.initBiquadFilter(this.filterType.options[this.filterType.selectedIndex].value);
        this.synth.setOsc1Detune(this.osc1Detune.value);
        this.synth.setOsc2Detune(this.osc2Detune.value);
        this.synth.setEnvAttack(this.envAttack.value);
        this.synth.setEnvRelease(this.envRelease.value);

        this.updateFilterFreqOutput(12000);
        this.updateFilterQualityOutput(1);
        this.updateOsc1DetuneOutput(this.osc1Detune.value);
        this.updateOsc2DetuneOutput(this.osc2Detune.value);
        this.updateEnvAttackOutput(this.envAttack.value);
        this.updateEnvReleaseOutput(this.envRelease.value);

        this.bindEvents();
        this.synth.routeComponents();

        this.noteDown = false;
    }

    UI.prototype.bindEvents = function () {
        this.keyboard.addEventListener('mousedown', this.noteStart.bind(this), false);
        this.keyboard.addEventListener('mouseup', this.noteEnd.bind(this), false);
        this.keyboard.addEventListener('mouseleave', this.noteEnd.bind(this), false);

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

    UI.prototype.onFilterTypeChange = function (e) {
        this.synth.setFilterType(e.target.value);
    };

    UI.prototype.onFilterFreqChange = function (e) {
        this.updateFilterFreqOutput(e.target.value);
        this.synth.setFilterFreq(e.target.value);
    };

    UI.prototype.onFilterQualityChange = function (e) {
        this.updateFilterQualityOutput(e.target.value);
        this.synth.setFilterQuality(e.target.value);
    };

    UI.prototype.setFilterFreq = function (freq) {
        this.filterFreq.value = freq;
    };

    UI.prototype.setFilterQuality = function (q) {
        this.filterQuality.value = q;
    };

    UI.prototype.updateFilterFreqOutput = function (freq) {
        this.filterFreqOutput.innerHTML = freq;
    };

    UI.prototype.updateFilterQualityOutput = function (q) {
        this.filterQualityOutput.innerHTML = q;
    };

    UI.prototype.onOsc1WaveChange = function (e) {
        this.synth.setOsc1Wave(e.target.value);
    };

    UI.prototype.onOsc2WaveChange = function (e) {
        this.synth.setOsc2Wave(e.target.value);
    };

    UI.prototype.onOsc1DetuneChange = function (e) {
        this.synth.setOsc1Detune(e.target.value);
        this.updateOsc1DetuneOutput(e.target.value);
    };

    UI.prototype.onOsc2DetuneChange = function (e) {
        this.synth.setOsc2Detune(e.target.value);
        this.updateOsc2DetuneOutput(e.target.value);
    };

    UI.prototype.updateOsc1DetuneOutput = function (cents) {
        this.osc1DetuneOutput.innerHTML = cents;
    };

    UI.prototype.updateOsc2DetuneOutput = function (cents) {
        this.osc2DetuneOutput.innerHTML = cents;
    };

    UI.prototype.onEnvAttackChange = function (e) {
        this.synth.setEnvAttack(e.target.value);
        this.updateEnvAttackOutput(e.target.value);
    };

    UI.prototype.onEnvReleaseChange = function (e) {
        this.synth.setEnvRelease(e.target.value);
        this.updateEnvReleaseOutput(e.target.value);
    };

    UI.prototype.updateEnvAttackOutput = function (time) {
        this.envAttackOutput.innerHTML = time;
    };

    UI.prototype.updateEnvReleaseOutput = function (time) {
        this.envReleaseOutput.innerHTML = time;
    };

    UI.prototype.updateFilter = function () {
        var freq = this.synth.getFilterFreq();
        var q = this.synth.getFilterQuality();
        this.setFilterFreq(freq);
        this.updateFilterFreqOutput(freq);
        this.setFilterQuality(q);
        this.updateFilterQualityOutput(q);
    };

    UI.prototype.noteStart = function (e) {
        e.preventDefault();
        var key = document.elementFromPoint(e.clientX, e.clientY);
        this.noteDown = true;
        this.synth.setOscFreq(key.getAttribute('data-id'));
        this.synth.keyDown();
        this.keyboard.addEventListener('mousemove', this.noteMove.bind(this), false);
    };

    UI.prototype.noteMove = function (e) {
        e.preventDefault();
        var key = document.elementFromPoint(e.clientX, e.clientY);
        if (this.noteDown) {
            this.synth.setOscFreq(key.getAttribute('data-id'));
            this.synth.keyMove(1);
        }
    };

    UI.prototype.noteEnd = function (e) {
        e.preventDefault();
        if (this.noteDown) {
            this.synth.keyUp();
            this.keyboard.removeEventListener('mousemove', this.noteMove.bind(this), false);
            this.noteDown = false;
        }
    };

    window.UI = UI;

}(window, document));
