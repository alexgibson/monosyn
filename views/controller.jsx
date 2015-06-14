import React from 'react';
import DefaultLayout from './layouts/default';

export default React.createClass({
  render: function() {
    return (
        <DefaultLayout title={this.props.title}>
            <div id="filter">Filter mod controller</div>
            <script src="/js/dist/controller-bundle.js"></script>
        </DefaultLayout>
    );
  }
});
