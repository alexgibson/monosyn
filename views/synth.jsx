import React from 'react';
import DefaultLayout from './layouts/default';

export default React.createClass({
    render() {
        return (
            <DefaultLayout title={this.props.title}>
                <main role="main" id="synth" data-id={this.props.id}>
                    <h1>{this.props.title}</h1>
                    <section id="monosyn"></section>
                    <footer>
                      Filter mod: <a href={this.props.link} target="_blank">{this.props.link}</a>
                    </footer>
                </main>
                <script src="/js/dist/synth-bundle.js"></script>
            </DefaultLayout>
        );
    }
});
