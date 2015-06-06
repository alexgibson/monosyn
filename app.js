'use strict';

var express = require('express');
var routes = require('./routes');
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var favicon = require('serve-favicon');
var errorHandler = require('errorhandler');
var logger = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var multer = require('multer');
var utils = require('./lib/utils');

// The `consolidate` adapter module
var cons = require('consolidate');

app.engine('hbs', cons.handlebars);

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
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
    socket.on('remoteClientSize', function (msg) {
        socket.broadcast.to(msg.room).emit('clientSize', msg);
    });
    socket.on('remoteFilterStart', function (msg) {
        socket.broadcast.to(msg.room).emit('filterStart', msg);
    });
    socket.on('remoteFilterMove', function (msg) {
        socket.broadcast.to(msg.room).emit('filterMove', msg);
    });
    socket.on('remoteFilterEnd', function (msg) {
        socket.broadcast.to(msg.room).emit('filterEnd', msg);
    });
    socket.on('disconnect', function (data) {
        //console.log('disconnected');
    });
});

server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
