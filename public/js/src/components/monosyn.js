import React from 'react';
import io from 'socket.io-client';
import Oscillator from './oscillator';
import BiquadFilter from './biquad-filter';
import Envelope from './envelope';
import Keyboard from './keyboard';
import AudioEngine from '../synth/engine';

export default React.createClass({
    getInitialState() {
        return {
            osc1Detune: this.props.data.osc1.detune,
            osc2Detune: this.props.data.osc2.detune,
            freq: this.props.data.filter.freq,
            q: this.props.data.filter.initialQ,
            attack: this.props.data.envelope.attack,
            release: this.props.data.envelope.release,
            status: 'disconnected'
        };
    },
    componentWillMount() {
        this.mouseDown = false;
        this.keyDown = false;
        this.octaveShift = 0;

        this.engine = new AudioEngine();
        this.osc = this.engine.getSource();
        this.osc.setOsc1Wave(this.props.data.osc1.wave);
        this.osc.setOsc2Wave(this.props.data.osc2.wave);
        this.osc.setOsc1Detune(this.props.data.osc1.detune);
        this.osc.setOsc2Detune(this.props.data.osc2.detune);
        this.engine.setFilterQuality(this.props.data.filter.q);
        this.engine.setFilterType(this.props.data.filter.type);
        this.engine.setFilterFreq(this.props.data.filter.freq);

        let socket = io();

        socket.on('connect', () => {

            let id = document.getElementById('synth-id').innerHTML;
            socket.emit('room', id);

            socket.on('disconnect', () => {
                this.setState({
                    status: 'disconnected'
                });
            });

            socket.on('remoteConnected', () => {
                this.setState({
                    status: 'connected'
                });
            });

            socket.on('clientSize', (data) => {
                this.engine.setOptions(data);
            });

            socket.on('filterStart', (data) => {
                this.engine.getFilterValuesFromTouch(data.x, data.y);
                this.setState({
                    freq: this.engine.getFilterFreq(),
                    q: this.engine.getFilterQuality()
                });
            });

            socket.on('filterMove', (data) => {
                this.engine.getFilterValuesFromTouch(data.x, data.y);
                this.setState({
                    freq: this.engine.getFilterFreq(),
                    q: this.engine.getFilterQuality()
                });
            });
        });

        document.addEventListener('keydown', this.handleKeyDown, true);
        document.addEventListener('keyup', this.handleKeyUp, true);
    },
    setFilterState(data) {
        this.engine.getFilterValuesFromTouch(data.x, data.y);
        this.setState({
            freq: this.engine.getFilterFreq(),
            q: this.engine.getFilterQuality()
        });
    },
    setEngineOptions(data) {
        this.engine.setOptions(data);
    },
    handleOsc1WaveChange(e) {
        this.osc.setOsc1Wave(e.target.value);
    },
    handleOsc2WaveChange(e) {
        this.osc.setOsc2Wave(e.target.value);
    },
    handleOsc1DetuneChange(e) {
        let value = e.target.value;
        this.osc.setOsc1Detune(value);
        this.setState({
            osc1Detune : value
        });
    },
    handleOsc2DetuneChange(e) {
        let value = e.target.value;
        this.osc.setOsc2Detune(value);
        this.setState({
            osc2Detune : value
        });
    },
    handleFilterTypeChange(e) {
        this.engine.setFilterType(e.target.value);
    },
    handleFilterFreqChange(e) {
        this.setState({
            freq: e.target.value
        });
        this.engine.setFilterFreq(e.target.value);
    },
    handleFilterQualityChange(e) {
        this.setState({
            q: e.target.value
        });
        this.engine.setFilterQuality(e.target.value);
    },
    handleEnvAttackChange(e) {
        this.setState({
            attack: e.target.value
        });
        this.engine.setEnvAttack(e.target.value);
    },
    handleEnvReleaseChange(e) {
        this.setState({
            release: e.target.value
        });
        this.engine.setEnvRelease(e.target.value);
    },
    handleMouseDown(e) {
        e.preventDefault();
        let freq = this.engine.getFreqFromNote(e.target.textContent);

        this.osc.setFreq(freq);
        this.engine.noteStart();
        this.mouseDown = true;
        this.currentNote = freq;
    },
    handleMouseMove(e) {
        e.preventDefault();
        let freq = this.engine.getFreqFromNote(e.target.textContent);

        if (this.mouseDown && this.currentNote !== freq) {
            this.osc.setFreq(freq);
            this.engine.noteMove(1);
            this.currentNote = freq;
        }
    },
    handleMouseUp(e) {
        e.preventDefault();
        if (this.mouseDown) {
            this.engine.noteEnd();
            this.mouseDown = false;
        }
    },
    handleKeyDown(e) {
        let note = this.props.data.chars[e.key] + (this.octaveShift * 12);
        let freq;
        if (note && !this.keyDown) {
            e.preventDefault();
            freq = this.engine.getFreqFromNote(note);
            this.osc.setFreq(freq);
            this.engine.noteStart();
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
            this.engine.noteEnd();
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
