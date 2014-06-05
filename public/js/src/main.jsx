/** @jsx React.DOM */

(function (window, document) {
    'use strict';

    /*
     * Get the party started
     */
    function init () {
        var socket = io();
        var engine = new AudioEngine();
        var osc = engine.getSource();

        socket.on('connect', function () {
            var id = document.getElementById('synth-id').innerHTML;
            socket.emit('room', id);

            socket.on('clientSize', function (data) {
                engine.setOptions(data);
            });

            socket.on('disconnect', function () {
                //console.log('disconnected');
            });
        });

        osc.setOsc1Wave(data.osc1.wave);
        osc.setOsc2Wave(data.osc2.wave);
        osc.setOsc1Detune(data.osc1.initialDetune);
        osc.setOsc2Detune(data.osc2.initialDetune);
        engine.setFilterQuality(data.filter.initialQ);
        engine.setFilterType(data.filter.type);
        engine.setFilterFreq(data.filter.initialFreq);

        var Oscillator = React.createClass({
            render: function () {
                var waves = this.props.waves;
                return (
                    <section className="component">
                        <h2>Oscillator</h2>
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

        var BiquadFilter = React.createClass({
            render: function() {
                var filters = this.props.filters;
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

        var Envelope = React.createClass({
            render: function () {
                return (
                    <section className="component">
                        <h2>Envelope</h2>
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

        var Keyboard = React.createClass({
            render: function () {
                var keyboard = this.props.keys;
                return (
                    <ul id="keyboard"
                        onMouseDown={this.props.onMouseDown}
                        onMouseMove={this.props.onMouseMove}
                        onMouseUp={this.props.onMouseUp}
                        onMouseLeave={this.props.onMouseUp}>
                        {keyboard.map(function (k) {
                            return <li key={k.note} className={k.cls} data-id={k.note}></li>;
                        })}
                    </ul>
                );
            }
        });

        var ModulationController = React.createClass({
            getInitialState: function () {
                return {
                    osc1Detune: this.props.data.osc1.initialDetune,
                    osc2Detune: this.props.data.osc2.initialDetune,
                    freq: this.props.data.filter.initialFreq,
                    q: this.props.data.filter.initialQ,
                    attack: this.props.data.envelope.initialAttack,
                    release: this.props.data.envelope.initialRelease,
                };
            },
            componentWillMount: function () {
                var self = this;

                this.playing = false;
                this.octaveShift = 0;

                socket.on('filterStart', function (data) {
                    engine.getFilterValuesFromTouch(data.x, data.y);
                    self.setState({
                        freq: engine.getFilterFreq(),
                        q: engine.getFilterQuality()
                    });
                });

                socket.on('filterMove', function (data) {
                    engine.getFilterValuesFromTouch(data.x, data.y);
                    self.setState({
                        freq: engine.getFilterFreq(),
                        q: engine.getFilterQuality()
                    });
                });

                document.addEventListener('keydown', this.handleKeyDown, false);
                document.addEventListener('keyup', this.handleKeyUp, false);
            },
            handleOsc1WaveChange: function (e) {
                osc.setOsc1Wave(e.target.value);
            },
            handleOsc2WaveChange: function (e) {
                osc.setOsc2Wave(e.target.value);
            },
            handleOsc1DetuneChange: function (e) {
                var value = e.target.value;
                osc.setOsc1Detune(value);
                this.setState({
                    osc1Detune : value
                });
            },
            handleOsc2DetuneChange: function (e) {
                var value = e.target.value;
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
                var key = document.elementFromPoint(e.clientX, e.clientY);
                var freq = engine.getFreqFromNote(key.getAttribute('data-id'));

                osc.setFreq(freq);
                engine.noteStart();
                this.playing = true;
                this.currentNote = freq;
            },
            handleMouseMove: function (e) {
                e.preventDefault();
                var key = document.elementFromPoint(e.clientX, e.clientY);
                var freq = engine.getFreqFromNote(key.getAttribute('data-id'));

                if (this.playing && this.currentNote !== freq) {
                    osc.setFreq(freq);
                    engine.noteMove(1);
                    this.currentNote = freq;
                }
            },
            handleMouseUp: function (e) {
                e.preventDefault();
                if (this.playing) {
                    engine.noteEnd();
                    this.playing = false;
                }
            },
            handleKeyDown: function (e) {
                var note = data.chars[e.key] + (this.octaveShift * 12);
                var freq;
                if (note) {
                    e.preventDefault();
                    freq = engine.getFreqFromNote(note);
                    if (!this.playing) {
                        osc.setFreq(freq);
                        engine.noteStart();
                        this.playing = true;
                        this.currentNote = freq;
                    } else if (this.currentNote !== freq) {
                        osc.setFreq(freq);
                        engine.noteMove(1);
                        this.currentNote = freq;
                    }
                }
            },
            handleKeyUp: function (e) {
                if (this.playing) {
                    e.preventDefault();
                    engine.noteEnd();
                    this.playing = false;
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
                        <Keyboard
                            keys={this.props.data.keys}
                            onMouseDown={this.handleMouseDown}
                            onMouseMove={this.handleMouseMove}
                            onMouseUp={this.handleMouseUp} />
                    </div>
                );
            }
        });

        React.renderComponent(
          <ModulationController data={data} />,
          document.getElementById('monosyn')
        );
    }

    window.addEventListener('DOMContentLoaded', init, false);

}(window, document));
