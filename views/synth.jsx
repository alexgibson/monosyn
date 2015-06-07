var React = require('react');
var DefaultLayout = require('./layouts/default');

var Synth = React.createClass({
  render: function() {
    'use strict';
    return (
        <DefaultLayout title={this.props.title}>
            <main role="main" id="synth">
                <h1>{ this.props.title }</h1>
                <p className="synth-id-label">ID: <span id="synth-id">{this.props.id}</span></p>
                <div id="monosyn"></div>
            </main>
            <script src="/js/dist/synth-bundle.js"></script>
        </DefaultLayout>
    );
  }
});

module.exports = Synth;
