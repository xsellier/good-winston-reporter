'use strict';

var Hapi                = require('hapi');
var winston             = require('winston');
var server              = new Hapi.Server();
var GoodWinstonReporter = require('../../lib');

server.connection({ host: 'localhost', port: 3000 });

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    setTimeout(function() {
      request.log('debug', 'New incoming request');
      reply('Hello, world!');
    }, 500);
  }
});

server.route({
  method: 'GET',
  path: '/{name}',
  handler: function (request, reply) {
    reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
  }
});


var options = {
  opsInterval  : 5000,
  reporters    : [{
    reporter   : GoodWinstonReporter,
    events     : {
      log      : 'info',
      request  : 'info',
      response : 'info',
      error    : 'info',
      ops      : 'info'
    },
    config     : {
      logger   : winston
    }
  }]
};

server.register({
  register : require('good'),
  options  : options
}, function (err) {
  if (err) {
    console.error(err);
  }
  else {
    server.start(function () {
      console.info('Server started at ' + server.info.uri);
    });

    server.log('info', 'This is not a real test');
  }
});
