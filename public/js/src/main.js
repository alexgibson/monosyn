import AudioEngine from './engine';
import MonosynData from './data';

let React = require('react');

window.addEventListener('DOMContentLoaded', () => {

    let socket = io();
    let engine = new AudioEngine();
    let osc = engine.getSource();

    socket.on('connect', () => {
        let id = document.getElementById('synth-id').innerHTML;
        socket.emit('room', id);

        socket.on('clientSize', function (data) {
            engine.setOptions(data);
        });

        socket.on('disconnect', function () {
            //console.log('disconnected');
        });
    });

    osc.setOsc1Wave(MonosynData.osc1.wave);
    osc.setOsc2Wave(MonosynData.osc2.wave);
    osc.setOsc1Detune(MonosynData.osc1.initialDetune);
    osc.setOsc2Detune(MonosynData.osc2.initialDetune);
    engine.setFilterQuality(MonosynData.filter.initialQ);
    engine.setFilterType(MonosynData.filter.type);
    engine.setFilterFreq(MonosynData.filter.initialFreq);

    let Oscillator = React.createClass({
        render: function () {
            let waves = this.props.waves;
            return (
                <section className="component">
                    <h2>Osc</h2>
                    <select autoComplete="off"
                        defaultValue={this.props.data.wave}
                        id={this.props.data.ref}
                        ref={this.props.data.ref}
                        onChange={this.props.onWaveChange}>
                        {waves.map(function (wave) {
                            return <option key={wave.id} value={wave.id}>{wave.text}</option>;
                        })}
                    </select>
                    <p>
                        <label htmlFor={this.props.data.detuneId}>Detune</label>
                        <output htmlFor={this.props.data.detuneId}>
                            {this.props.detune}
                        </output>
                        <input
                            type="range"
                            id={this.props.data.detuneId}
                            min={this.props.data.minDetune}
                            max={this.props.data.maxDetune}
                            step="1"
                            defaultValue={this.props.detune}
                            autoComplete="off"
                            onChange={this.props.onDetuneChange}/>
                    </p>
                </section>
            );
        }
    });

    let BiquadFilter = React.createClass({
        render: function() {
            let filters = this.props.filters;
            return (
                <section className="component">
                    <h2>Filter</h2>
                    <select ref="filter"
                        defaultValue={this.props.data.type}
                        onChange={this.props.onFilterTypeChange}>
                        {filters.map(function (filter) {
                            return <option key={filter.id} value={filter.id}>{filter.text}</option>;
                        })}
                    </select>
                    <p>
                        <label htmlFor="filter-freq">Freq</label>
                        <output htmlFor="filter-freq">
                            {this.props.freq}
                        </output>
                        <input type="range"
                            id="filter-freq"
                            ref="freq"
                            min={this.props.data.minFreq}
                            max={this.props.data.maxFreq}
                            step="1"
                            defaultValue={this.props.freq}
                            value={this.props.freq}
                            autoComplete="off"
                            onChange={this.props.onFilterFreqChange} />
                    </p>
                    <p>
                        <label htmlFor="filter-q">Q</label>
                        <output htmlFor="filter-q">
                            {this.props.q}
                        </output>
                        <input type="range"
                            id="filter-q"
                            ref="q"
                            min={this.props.data.minQ}
                            max={this.props.data.maxQ}
                            step="0.001"
                            defaultValue={this.props.q}
                            value={this.props.q}
                            autoComplete="off"
                            onChange={this.props.onFilterQualityChange} />
                    </p>
                </section>
            );
        }
    });

    let Envelope = React.createClass({
        render: function () {
            return (
                <section className="component">
                    <h2>Env</h2>
                    <p>
                        <label htmlFor="env-attack">Attack</label>
                        <output htmlFor="env-attack">
                            {this.props.attack}
                        </output>
                        <input type="range"
                            id="env-attack"
                            min={this.props.data.min}
                            max={this.props.data.max}
                            step="0.1"
                            defaultValue={this.props.attack}
                            onChange={this.props.onEnvAttackChange}
                            autoComplete="off" />
                    </p>
                    <p>
                        <label htmlFor="env-release">Release</label>
                        <output htmlFor="env-release">
                            {this.props.release}
                        </output>
                        <input type="range"
                            id="env-release"
                            min={this.props.data.min}
                            max={this.props.data.max}
                            step={this.props.data.step}
                            defaultValue={this.props.release}
                            onChange={this.props.onEnvReleaseChange}
                            autoComplete="off" />
                    </p>
                </section>
            );
        }
    });

    let Keyboard = React.createClass({
        render: function () {
            let keyboard = this.props.keys;
            let props = this.props;
            return (
                <ol id="keyboard" onMouseLeave={this.props.onMouseUp}>
                    {keyboard.map(function (k) {
                        let classString = 'key ' + k.cls;
                        return  <li key={k.note}
                                    className={classString}
                                    onMouseDown={props.onMouseDown}
                                    onMouseMove={props.onMouseMove}
                                    onMouseUp={props.onMouseUp}>
                                    {k.note}
                                </li>;
                    })}
                </ol>
            );
        }
    });

    let statusIndicator = React.createClass({
        render: function () {
            return (
                <div id="status">Remote {this.props.status} <span id="indicator" className={this.props.status}></span></div>
            );
        }
    });

    let Monosyn = React.createClass({
        getInitialState: function () {
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
        componentWillMount: function () {
            this.mouseDown = false;
            this.keyDown = false;
            this.octaveShift = 0;

            socket.on('remoteConnected', (data) => {
                this.setState({
                    status: 'connected'
                });
            });

            socket.on('filterStart', (data) => {
                engine.getFilterValuesFromTouch(data.x, data.y);
                this.setState({
                    freq: engine.getFilterFreq(),
                    q: engine.getFilterQuality()
                });
            });

            socket.on('filterMove', (data) => {
                engine.getFilterValuesFromTouch(data.x, data.y);
                this.setState({
                    freq: engine.getFilterFreq(),
                    q: engine.getFilterQuality()
                });
            });

            document.addEventListener('keydown', this.handleKeyDown, true);
            document.addEventListener('keyup', this.handleKeyUp, true);
        },
        handleOsc1WaveChange: function (e) {
            osc.setOsc1Wave(e.target.value);
        },
        handleOsc2WaveChange: function (e) {
            osc.setOsc2Wave(e.target.value);
        },
        handleOsc1DetuneChange: function (e) {
            let value = e.target.value;
            osc.setOsc1Detune(value);
            this.setState({
                osc1Detune : value
            });
        },
        handleOsc2DetuneChange: function (e) {
            let value = e.target.value;
            osc.setOsc2Detune(value);
            this.setState({
                osc2Detune : value
            });
        },
        handleFilterTypeChange: function (e) {
            engine.setFilterType(e.target.value);
        },
        handleFilterFreqChange: function (e) {
            this.setState({
                freq: e.target.value
            });
            engine.setFilterFreq(e.target.value);
        },
        handleFilterQualityChange: function (e) {
            this.setState({
                q: e.target.value
            });
            engine.setFilterQuality(e.target.value);
        },
        handleEnvAttackChange: function (e) {
            this.setState({
                attack: e.target.value
            });
            engine.setEnvAttack(e.target.value);
        },
        handleEnvReleaseChange: function (e) {
            this.setState({
                release: e.target.value
            });
            engine.setEnvRelease(e.target.value);
        },
        handleMouseDown: function (e) {
            e.preventDefault();
            let freq = engine.getFreqFromNote(e.target.textContent);

            osc.setFreq(freq);
            engine.noteStart();
            this.mouseDown = true;
            this.currentNote = freq;
        },
        handleMouseMove: function (e) {
            e.preventDefault();
            let freq = engine.getFreqFromNote(e.target.textContent);

            if (this.mouseDown && this.currentNote !== freq) {
                osc.setFreq(freq);
                engine.noteMove(1);
                this.currentNote = freq;
            }
        },
        handleMouseUp: function (e) {
            e.preventDefault();
            if (this.mouseDown) {
                engine.noteEnd();
                this.mouseDown = false;
            }
        },
        handleKeyDown: function (e) {
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
        handleKeyUp: function (e) {
            if (this.keyDown) {
                e.preventDefault();
                engine.noteEnd();
                this.keyDown = false;
            }
        },
        render: function() {
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

    React.render(
      <Monosyn data={MonosynData} />,
      document.getElementById('monosyn')
    );
});
