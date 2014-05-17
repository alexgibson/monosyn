exports.createId = function () {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    var id = '';
    for (var i = 0; i < 8; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        id += chars.substring(rnum, rnum + 1);
    }
    return id;
};

exports.isValidId = function (id) {
	return /^[a-zA-Z0-9]+$/.test(id) && id.length === 8;
};

exports.isRemote = function (ua) {
	return /mobi|tablet/i.test(ua);
};
