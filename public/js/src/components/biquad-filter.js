import React from 'react';

export default React.createClass({
    render() {
        'use strict';
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
