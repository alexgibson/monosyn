var React = require('react');

var DefaultLayout = React.createClass({
    render: function() {
        'use strict';
        return (
            <html>
                <head>
                    <meta charset="utf-8" />
                    <title>{this.props.title}</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="stylesheet" href="/css/synth.css" />
                </head>
                <body>{this.props.children}</body>
            </html>
        );
    }
});

module.exports = DefaultLayout;
