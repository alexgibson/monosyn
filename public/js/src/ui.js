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

        this.bindEvents();
        this.synth.routeComponents();

        this.noteDown = false;
    }

    UI.prototype.bindEvents = function () {
        var self = this;

        this.keyboard.addEventListener('mousedown', this.noteStart.bind(this), false);
        this.keyboard.addEventListener('mouseup', this.noteEnd.bind(this), false);
        this.keyboard.addEventListener('mouseleave', this.noteEnd.bind(this), false);

        this.filterFreq.addEventListener('input', function () {
            self.updateFilterFreqOutput(this.value);
            self.synth.setFilterFreq(this.value);
        }, false);

        this.filterQuality.addEventListener('input', function () {
            self.updateFilterQualityOutput(this.value);
            self.synth.setFilterQuality(this.value);
        }, false);

        this.filterType.addEventListener('change', function () {
            self.synth.setFilterType(this.value);
        });

        this.osc1.addEventListener('change', function () {
            self.synth.setOsc1Wave(this.value);
        });

        this.osc2.addEventListener('change', function () {
            self.synth.setOsc2Wave(this.value);
        });

        this.osc1Detune.addEventListener('input', function () {
            self.synth.setOsc1Detune(this.value);
            self.updateOsc1DetuneOutput(this.value);
        }, false);

        this.osc2Detune.addEventListener('input', function () {
            self.synth.setOsc2Detune(this.value);
            self.updateOsc2DetuneOutput(this.value);
        }, false);

        this.envAttack.addEventListener('input', function () {
            self.synth.setEnvAttack(this.value);
        }, false);

        this.envRelease.addEventListener('input', function () {
            self.synth.setEnvRelease(this.value);
        }, false);
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

    UI.prototype.updateOsc1DetuneOutput = function (cents) {
        this.osc1DetuneOutput.innerHTML = cents;
    };

    UI.prototype.updateOsc2DetuneOutput = function (cents) {
        this.osc2DetuneOutput.innerHTML = cents;
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
        this.synth.setOscFreq(parseFloat(key.getAttribute('data-id')));
        this.synth.keyDown();
        this.keyboard.addEventListener('mousemove', this.noteMove.bind(this), false);
    };

    UI.prototype.noteMove = function (e) {
        e.preventDefault();
        var key = document.elementFromPoint(e.clientX, e.clientY);
        if (this.noteDown) {
            this.synth.setOscFreq(parseFloat(key.getAttribute('data-id')));
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
