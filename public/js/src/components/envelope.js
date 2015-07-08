import React from 'react';

export default React.createClass({
    render: function() {
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
