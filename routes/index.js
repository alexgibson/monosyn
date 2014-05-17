'use strict';

var utils = require('../lib/utils');

exports.index = function(req, res) {
    var ua = req.header('user-agent');

    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);

    if (utils.isRemote(ua)) {
        res.render('remote', {
            title: 'Monosyn'
        });
    } else {
        res.render('synth', {
            title: 'Monosyn',
            id: utils.createId()
        });
    }
};
