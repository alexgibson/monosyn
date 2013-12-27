monosyn
=======

Web Audio synthesiser with a Node powered modulation controller.

Features a dual oscillator subtractive synth on desktop browsers. Connect your mobile browser to act as a real-time filter control.

Built using Web Audio API, Node.js, Express & Socket.io.

TODO
----

* Add second oscillator with detune controls
* Add envolope control section
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

Browser support
---------------

Monosyn uses unprefixed Web Audio API syntax, so currently works best in Firefox. The mobile controller should work on any device that supports touch events.
