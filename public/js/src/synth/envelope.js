class Envelope {

    constructor(ctx) {
        this.env = ctx.createGain();
        this.env.gain.value = 0;
        this.options = {
            attack: 0,
            release: 0
        };
    }

    connect(output) {
        this.env.connect(output);
    }

    setAttack(time) {
        this.options.attack = parseFloat(time);
    }

    setRelease(time) {
        this.options.release = parseFloat(time);
    }

    /*
     * Set the source frequency and gain value on key down
     */
    attack(time) {
        this.env.gain.cancelScheduledValues(time);
        this.env.gain.setValueAtTime(0, time);
        this.env.gain.linearRampToValueAtTime(1, time + this.options.attack);
    }

    /*
     * Set the source frequency and gain value on key move
     */
    sustain(val) {
        this.env.gain.value = val;
    }

    /*
     * Mute the source gain value on key up
     */
    release(time) {
        this.env.gain.cancelScheduledValues(time);
        this.env.gain.linearRampToValueAtTime(0, time + this.options.release);
    }

    getNode() {
        return this.env;
    }
}

export default Envelope;
