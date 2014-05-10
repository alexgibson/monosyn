Monosyn
=======

A Web Audio synthesiser with a Node.js powered modulation controller.

Monosyn is a 61 key, monophonic, subtractive synthesizer for desktop browsers. It features dual oscillators, biquad filter and envelope controls. Connect your mobile device to act as a touch-based real time filter modulation control.

Monosyn is built using [Web Audio API](http://www.w3.org/TR/webaudio/), [Node.js](http://nodejs.org), [Express](http://expressjs.com), [Handlebars](http://handlebarsjs.com) & [Socket.io](http://socket.io).

TODO
----

* Add Querty Keyboard support
* Synth needs a decent UI!
* Remote filter control also needs a UI
* Ability to load/save presets as JSON.
* Support mobile device orientation change

Future
------

* [Web MIDI API](http://www.w3.org/TR/webmidi/) support (Polyfill?)

Installation
------------

`npm install`

Then run the server

`node app`

For development, you can just run `grunt` to start the server and watch for changes.

Browser support
---------------

Monosyn uses un-prefixed [Web Audio API](http://www.w3.org/TR/webaudio/) syntax, so currently works best in either Firefox or Chrome Canary. The remote modulation controller should work on any mobile device that supports [touch events](http://www.w3.org/TR/touch-events/).
