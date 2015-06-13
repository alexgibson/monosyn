import React from 'react';
import Oscillator from './components/oscillator';
import BiquadFilter from './components/biquad-filter';
import Envelope from './components/envelope';
import Keyboard from './components/keyboard';
import AudioEngine from './synth/engine';

export default React.createClass({
    getInitialState() {
        return {
            osc1Detune: this.props.data.osc1.initialDetune,
            osc2Detune: this.props.data.osc2.initialDetune,
            freq: this.props.data.filter.initialFreq,
            q: this.props.data.filter.initialQ,
            attack: this.props.data.envelope.initialAttack,
            release: this.props.data.envelope.initialRelease,
            status: 'disconnected'
        };
    },
    componentWillMount() {
        this.mouseDown = false;
        this.keyDown = false;
        this.octaveShift = 0;

        engine.loadPreset(this.props.data);

        document.addEventListener('keydown', this.handleKeyDown, true);
        document.addEventListener('keyup', this.handleKeyUp, true);
    },
    handleOsc1WaveChange(e) {
        osc.setOsc1Wave(e.target.value);
    },
    handleOsc2WaveChange(e) {
        osc.setOsc2Wave(e.target.value);
    },
    handleOsc1DetuneChange(e) {
        let value = e.target.value;
        osc.setOsc1Detune(value);
        this.setState({
            osc1Detune : value
        });
    },
    handleOsc2DetuneChange(e) {
        let value = e.target.value;
        osc.setOsc2Detune(value);
        this.setState({
            osc2Detune : value
        });
    },
    handleFilterTypeChange(e) {
        engine.setFilterType(e.target.value);
    },
    handleFilterFreqChange(e) {
        this.setState({
            freq: e.target.value
        });
        engine.setFilterFreq(e.target.value);
    },
    handleFilterQualityChange(e) {
        this.setState({
            q: e.target.value
        });
        engine.setFilterQuality(e.target.value);
    },
    handleEnvAttackChange(e) {
        this.setState({
            attack: e.target.value
        });
        engine.setEnvAttack(e.target.value);
    },
    handleEnvReleaseChange(e) {
        this.setState({
            release: e.target.value
        });
        engine.setEnvRelease(e.target.value);
    },
    handleMouseDown(e) {
        e.preventDefault();
        let freq = engine.getFreqFromNote(e.target.textContent);

        osc.setFreq(freq);
        engine.noteStart();
        this.mouseDown = true;
        this.currentNote = freq;
    },
    handleMouseMove(e) {
        e.preventDefault();
        let freq = engine.getFreqFromNote(e.target.textContent);

        if (this.mouseDown && this.currentNote !== freq) {
            osc.setFreq(freq);
            engine.noteMove(1);
            this.currentNote = freq;
        }
    },
    handleMouseUp(e) {
        e.preventDefault();
        if (this.mouseDown) {
            engine.noteEnd();
            this.mouseDown = false;
        }
    },
    handleKeyDown(e) {
        let note = data.chars[e.key] + (this.octaveShift * 12);
        let freq;
        if (note && !this.keyDown) {
            e.preventDefault();
            freq = engine.getFreqFromNote(note);
            osc.setFreq(freq);
            engine.noteStart();
            this.keyDown = true;
            this.currentNote = freq;
        } else {
            switch (e.key) {
            case 'Right':
                this.octaveShift += 1;
                break;
            case 'Left':
                this.octaveShift -= 1;
                break;
            }
        }
    },
    handleKeyUp(e) {
        if (this.keyDown) {
            e.preventDefault();
            engine.noteEnd();
            this.keyDown = false;
        }
    },
    render() {
        return (
            <div>
                <Oscillator
                    data={this.props.data.osc1}
                    waves={this.props.data.waves}
                    detune={this.state.osc1Detune}
                    onWaveChange={this.handleOsc1WaveChange}
                    onDetuneChange={this.handleOsc1DetuneChange} />
                <Oscillator
                    data={this.props.data.osc2}
                    waves={this.props.data.waves}
                    detune={this.state.osc2Detune}
                    onWaveChange={this.handleOsc2WaveChange}
                    onDetuneChange={this.handleOsc2DetuneChange} />
                <BiquadFilter
                    data={this.props.data.filter}
                    freq={this.state.freq}
                    q={this.state.q}
                    filters={this.props.data.filters}
                    onFilterTypeChange={this.handleFilterTypeChange}
                    onFilterFreqChange={this.handleFilterFreqChange}
                    onFilterQualityChange={this.handleFilterQualityChange} />
                <Envelope
                    data={this.props.data.envelope}
                    attack={this.state.attack}
                    release={this.state.release}
                    onEnvAttackChange={this.handleEnvAttackChange}
                    onEnvReleaseChange={this.handleEnvReleaseChange} />
                <statusIndicator
                    status={this.state.status} />
                <Keyboard
                    keys={this.props.data.keys}
                    onMouseDown={this.handleMouseDown}
                    onMouseMove={this.handleMouseMove}
                    onMouseUp={this.handleMouseUp} />
            </div>
        );
    }
});
