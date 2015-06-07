var React = require('react');
var DefaultLayout = require('./layouts/default');

var Controller = React.createClass({
  render: function() {
    'use strict';
    return (
        <DefaultLayout title={this.props.title}>
            <div id="filter">Filter mod controller</div>
            <script src="/js/dist/controller-bundle.js"></script>
        </DefaultLayout>
    );
  }
});

module.exports = Controller;
