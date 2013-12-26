
/*
 * GET home page.
 */

exports.index = function(req, res) {
    var ua = req.header('user-agent');
    if(/mobile/i.test(ua)) {
        res.render('remote');
    } else {
        res.render('synth');
    }
};
