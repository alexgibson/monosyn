import React from 'react';

export default React.createClass({
    render: function() {
        return (
            <html>
                <head>
                    <meta charSet="utf-8" />
                    <title>{this.props.title}</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="stylesheet" href="/css/synth.css" />
                </head>
                <body>{this.props.children}</body>
            </html>
        );
    }
});
