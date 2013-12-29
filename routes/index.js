'use strict';

exports.index = function(req, res) {
    var ua = req.header('user-agent');

    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);

    if(/mobile/i.test(ua)) {
        res.render('remote');
    } else {
        res.render('synth');
    }
};
