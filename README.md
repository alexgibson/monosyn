Monosyn
=======

[![Dependency Status](https://david-dm.org/alexgibson/monosyn.svg)](https://david-dm.org/alexgibson/monosyn) [![devDependency Status](https://david-dm.org/alexgibson/monosyn/dev-status.svg)](https://david-dm.org/alexgibson/monosyn#info=devDependencies)

A Node.js powered Web Audio synthesizer with remote filter modulation controller.

Monosyn is a 49 key, monophonic, subtractive synthesizer for desktop web browsers. It features dual oscillators, biquad filter and envelope controls. Connect your mobile device to act as a real-time filter modulation controller.

Monosyn is built using [Web Audio API](http://www.w3.org/TR/webaudio/), [React](http://facebook.github.io/react/), [Babel](https://babeljs.io/), [Node](http://nodejs.org) and [Socket.io](http://socket.io).

Installation
------------

Install dependencies:

`npm install`

Build the distribution:

`gulp js:compile`

Run the server:

`node app`

Local development
-----------------

For development purposes you can just type `gulp` to compile JS, start the server and watch for changes.

By default Javascript is compiled and minified in production mode. To run un-minified and with source maps enabled, simply run:

```
gulp --env development --smp /path/to/project/root/
```

Testing
-------

Tests are written using [Mocha](http://mochajs.org/) and [Supertest](https://github.com/visionmedia/supertest). To run the tests type:

`npm test`

Browser support
---------------

Monosyn uses [Web Audio API](http://www.w3.org/TR/webaudio/), so currently works best in the latest versions of Firefox, Chrome or Safari. The remote modulation controller should work on any mobile device that supports [touch events](http://www.w3.org/TR/touch-events/).
