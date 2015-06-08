'use strict';

var utils = require('../lib/utils');

exports.index = function(req, res) {
    res.render('synth', {
        title: 'Monosyn',
        id: utils.createId()
    });
};

exports.remote = function(req, res) {
    res.render('controller', {
        title: 'Monosyn'
    });
};
