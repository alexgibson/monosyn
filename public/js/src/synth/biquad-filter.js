class BiquadFilter {

    constructor(ctx) {
        this.filter = ctx.createBiquadFilter();
        this.remoteWidth = 0;
        this.remoteHeight = 0;
    }

    connect(output) {
        this.filter.connect(output);
    }

    /*
     * Set the filter frequency and q values based on touch coordinates
     * @param x (number), y (number)
     */
    setValuesFromTouch(x, y) {
        let freq = 12000 - (parseInt(y, 10) * (12000 / this.remoteHeight));
        let q = 10 - (this.remoteWidth - parseInt(x, 10)) / this.remoteWidth * 10;
        freq = Math.min(freq, 12000);
        freq = Math.max(40, freq);
        q = Math.min(q, 10);
        q = Math.max(1, q);
        this.setQuality(Math.round(q));
        this.setFreq(Math.round(freq));
    }

    getType(type) {
        return this.filter.type;
    }

    setType(type) {
        this.filter.type = type;
    }

    setFreq(freq) {
        this.filter.frequency.value = freq;
    }

    getFreq() {
        return this.filter.frequency.value;
    }

    getQuality() {
        return this.filter.Q.value;
    }

    setQuality(q) {
        this.filter.Q.value = q;
    }

    setRemoteSize(w, h) {
        this.remoteWidth = w;
        this.remoteHeight = h;
    }

    getNode() {
        return this.filter;
    }
}

export default BiquadFilter;
