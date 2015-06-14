import React from 'react';

export default React.createClass({
    render() {
        let keyboard = this.props.keys;
        let props = this.props;
        return (
            <ol id="keyboard" onMouseLeave={this.props.onMouseUp}>
                {keyboard.map(function (k) {
                    let active = parseInt(props.current, 10) === k.note ? ' pressed' : '';
                    let classString = 'key ' + k.cls + active;
                    return  <li key={k.note}
                                className={classString}
                                onMouseDown={props.onMouseDown}
                                onMouseMove={props.onMouseMove}
                                onMouseUp={props.onMouseUp}>
                                {k.note}
                            </li>;
                })}
            </ol>
        );
    }
});
