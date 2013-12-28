monosyn
=======

A Node.js powered Web Audio synthesiser.

Monosyn is a 49 key, monophonic, subtractive synthesizer for desktop browsers. It features dual oscillators, biquad filter and envelope controls. Connect your mobile device to act as a touch-based real time filter modulation control.

Monosyn is built using Web Audio API, Node.js, Express & Socket.io.

TODO
----

* Add second oscillator with detune controls
* Add envelope control section
* Add note hold setting
* Add Keyboard support
* Web Midi support (polyfill?)
* Synth needs a decent UI!
* Remote filter control also needs a UI
* Support mobile device orientation change
* Installation and setup instructions

Installation
------------

`npm install`

Then run the server

`node app`

For development, you can just run `grunt` to start the server and watch for changes.

Browser support
---------------

Monosyn uses unprefixed Web Audio API syntax, so currently works best in Firefox. The mobile controller should work on any device that supports touch events.
