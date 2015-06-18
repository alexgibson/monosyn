'use strict';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var bodyParser = require('body-parser');
var compression = require('compression');
var errorHandler = require('errorhandler');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var multer = require('multer');
var path = require('path');
var reactViews = require('express-react-views');
var routes = require('./routes');
var utils = require('./lib/utils');

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jsx');
app.engine('jsx', reactViews.createEngine());
app.use(compression());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

app.get('/', routes.index);
app.get('/r/', routes.remote);

io.on('connection', function (socket) {
    socket.on('room', function(id) {
        if (utils.isValidId(id)) {
            if(socket.room) {
                socket.leave(socket.room);
            }
            socket.room = id;
            socket.join(id);
        }
    });
    socket.on('resize', function (msg) {
        socket.broadcast.to(msg.room).emit('remote-resize', msg);
    });
    socket.on('touchstart', function (msg) {
        socket.broadcast.to(msg.room).emit('remote-filter-start', msg);
    });
    socket.on('touchmove', function (msg) {
        socket.broadcast.to(msg.room).emit('remote-filter-move', msg);
    });
    socket.on('touchend', function (msg) {
        socket.broadcast.to(msg.room).emit('remote-filter-end', msg);
    });
    socket.on('status', function(msg) {
        socket.broadcast.to(msg.room).emit('remote-status', msg);
    });
    socket.on('disconnect', function (data) {
        //console.log('disconnected');
    });
});

server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
