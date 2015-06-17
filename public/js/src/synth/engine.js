import DualOscillator from './dual-oscillator';
import BiquadFilter from './biquad-filter';

class AudioEngine {

    constructor() {
        // normalize and create a new AudioContext if supported
        window.AudioContext = window.AudioContext || window.webkitAudioContext;

        this.ctx = new window.AudioContext();
        this.nodes = {};
        this.options = {
            osc1: {
                wave: 'sine',
                detune: 0
            },
            osc2: {
                wave: 'sine',
                detune: 0
            },
            filter: {
                type: 'lowpass',
                freq: 12000,
                q: 1
            },
            env: {
                attack: 0,
                release: 0
            }
        };

        this.initComponents();
        this.routeComponents();
    }

    /*
     * Creates audio nodes
     */
    initComponents() {
        this.filter = new BiquadFilter(this.ctx);
        this.nodes.osc = new DualOscillator(this.ctx);
        this.nodes.oscGain = this.ctx.createGain();
        this.nodes.oscGain.gain.value = 0;
        this.nodes.filter = this.filter.getNode();
        this.nodes.masterComp = this.ctx.createDynamicsCompressor();
        this.nodes.masterGain = this.ctx.createGain();
        this.nodes.masterGain.gain.value = 0.9;
    }

    /*
     * Routes audio nodes starting with source (oscillator)
     * and finishing with destinations (speakers)
     */
    routeComponents(out) {
        this.nodes.osc.connect(this.nodes.filter);
        this.nodes.filter.connect(this.nodes.oscGain);
        this.nodes.oscGain.connect(this.nodes.masterComp);
        this.nodes.masterComp.connect(this.nodes.masterGain);
        this.nodes.masterGain.connect(this.ctx.destination);
        this.nodes.osc.start(0);
    }

    /*
     * Set the source frequency and gain value on key down
     */
    noteStart(vel) {
        let now = this.ctx.currentTime;
        this.nodes.oscGain.gain.cancelScheduledValues(now);
        this.nodes.oscGain.gain.setValueAtTime(0, now);
        this.nodes.oscGain.gain.linearRampToValueAtTime(1, now + this.options.env.attack);
    }

    /*
     * Set the source frequency and gain value on key move
     */
    noteMove(val) {
        this.nodes.oscGain.gain.value = val;
    }

    /*
     * Mute the source gain value on key up
     */
    noteEnd() {
        let now = this.ctx.currentTime;
        this.nodes.oscGain.gain.cancelScheduledValues(now);
        this.nodes.oscGain.gain.linearRampToValueAtTime(0, now + this.options.env.release);
    }

    /*
     * Returns the oscillator frequency for a given piano key number
     * @param note (number)
     * @return frequency (number)
     */
    getFreqFromNote(note) {
        return 440 * Math.pow(2, (note - 49) / 12);
    }

    setEnvAttack(time) {
        this.options.env.attack = parseFloat(time);
    }

    setEnvRelease(time) {
        this.options.env.release = parseFloat(time);
    }

    /*
     * Generic method for setting options that aren't directly
     * tied to a sound preset, such as remote client size.
     * @param options (object)
     */
    setOptions(options) {
        if (typeof options === 'object') {
            for (var i in options) {
                if (options.hasOwnProperty(i)) {
                    this.options[i] = options[i];
                }
            }
        }
    }

    /*
     * Loads a set of synth engine preset values
     * @param options (object)
     */
    loadPreset(options) {
        this.setOptions(options);

        this.nodes.osc.setOscWave({
            wave1: this.options.osc1.wave,
            wave2: this.options.osc2.wave
        });
        this.nodes.osc.setOscDetune({
            osc1: this.options.osc1.detune,
            osc2: this.options.osc2.detune
        });

        this.filter.setType(this.options.filter.type);
        this.filter.setFreq(this.options.filter.freq);
        this.filter.setQuality(this.options.filter.q);
        this.setEnvAttack(this.options.env.attack);
        this.setEnvRelease(this.options.env.release);
    }

    /*
     * Returns a reference to the source oscillator node
     */
    getSource() {
        return this.nodes.osc;
    }

    /*
     * Returns a reference to the filter component
     */
    getFilter() {
        return this.filter;
    }
}

export default AudioEngine;
