import React from 'react';

export default React.createClass({
    render() {
        return (
            <div id="status">Connection: <span id="indicator" className={this.props.status}></span></div>
        );
    }
});
