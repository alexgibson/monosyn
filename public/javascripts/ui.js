function UI (synth) {
    this.synth = synth;
    this.osc1 = document.getElementById('osc-1');
    this.filterType = document.getElementById('filter-type');
    this.filterFreq = document.getElementById('filter-freq');
    this.filterQuality = document.getElementById('filter-q');
    this.filterFreqOutput = document.getElementById('filter-freq-output');
    this.filterQualityOutput = document.getElementById('filter-q-output');
    this.keyboard = document.getElementById('keyboard');

    this.synth.initOscillator(this.osc1.options[this.osc1.selectedIndex].value);
    this.synth.initBiquadFilter(this.filterType.options[this.filterType.selectedIndex].value);

    this.updateFilterFreqOutput();
    this.updateFilterQualityOutput();

    this.bindEvents();
    this.synth.routeComponents();
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
        self.synth.setOscWave(this.value);
    });
};

UI.prototype.setFilterFreq = function (freq) {
    this.filterFreq.value = freq;
};

UI.prototype.setFilterQuality = function (q) {
    this.filterQuality.value = q;
};

UI.prototype.updateFilterFreqOutput = function (freq=12000) {
    this.filterFreqOutput.innerHTML = freq;
};

UI.prototype.updateFilterQualityOutput = function (q=1) {
    this.filterQualityOutput.innerHTML = q;
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
    this.synth.setOscFreq(parseFloat(key.getAttribute('data-id')));
    this.synth.keyDown();
    this.keyboard.addEventListener('mousemove', this.noteMove.bind(this), false);
};

UI.prototype.noteMove = function (e) {
    e.preventDefault();
    var key = document.elementFromPoint(e.clientX, e.clientY);
    this.synth.setOscFreq(parseFloat(key.getAttribute('data-id')));
    this.synth.keyMove(1);
};

UI.prototype.noteEnd = function (e) {
    e.preventDefault();
    this.synth.keyUp();
    this.keyboard.removeEventListener('mousemove', this.noteMove.bind(this), false);
};
