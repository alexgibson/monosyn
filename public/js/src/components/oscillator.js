import React from 'react';

export default React.createClass({
    render: function() {
        let waves = this.props.waves;
        return (
            <section className="component">
                <h2>Osc</h2>
                <select autoComplete="off"
                    defaultValue={this.props.data.wave}
                    id={this.props.data.ref}
                    ref={this.props.data.ref}
                    onChange={this.props.onWaveChange}>
                    {waves.map(function (id) {
                        return <option key={id} value={id}>{id}</option>;
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
