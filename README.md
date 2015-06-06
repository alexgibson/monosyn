Monosyn
=======

A Web Audio synthesiser with a Node.js powered modulation controller.

Monosyn is a 49 key, monophonic, subtractive synthesizer for desktop web browsers. It features dual oscillators, biquad filter and envelope controls. Connect your mobile device to act as a real-time filter modulation controller.

Monosyn is built using [Web Audio API](http://www.w3.org/TR/webaudio/), [React.js](http://facebook.github.io/react/), [Babel](https://babeljs.io/), [Node.js](http://nodejs.org) and [Socket.io](http://socket.io).

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

For development purposes, you can just run `gulp` to compile JS and watch for changes.

Browser support
---------------

Monosyn uses un-prefixed [Web Audio API](http://www.w3.org/TR/webaudio/) syntax, so currently works best in either Firefox or Chrome Canary. The remote modulation controller should work on any mobile device that supports [touch events](http://www.w3.org/TR/touch-events/).
