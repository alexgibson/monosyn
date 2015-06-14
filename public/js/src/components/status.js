import React from 'react';

export default React.createClass({
    render() {
        return (
            <div id="status">Remote: <span id="indicator" className={this.props.status}></span></div>
        );
    }
});
