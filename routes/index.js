'use strict';

var utils = require('../lib/utils');

exports.index = function(req, res) {
    var room = utils.createId();
    res.render('synth', {
        title: 'Monosyn',
        id: room,
        link: req.protocol + '://' + req.get('host') + '/r/#' + room
    });
};

exports.remote = function(req, res) {
    res.render('controller', {
        title: 'Monosyn'
    });
};
