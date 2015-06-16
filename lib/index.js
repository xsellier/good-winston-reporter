'use strict';

var _      = require('lodash');
var format = require('util').format;
var logger;

var availableLevels = ['silly', 'debug', 'verbose', 'info', 'warn', 'error'];

var defaultOptions = {
  log      : 'info',
  request  : 'debug',
  response : 'debug',
  error    : 'error',
  ops      : 'silly'
};

var GoodWinstonReporter = function(events, config) {
  logger       = config.logger;

  this.options = _.merge(defaultOptions, events, function(defaultOption, userOption) {
    var available = availableLevels.filter(function(level) {
      return level === userOption;
    })[0];

    return available || defaultOption;
  });

  // Pick only messages that are required by the user
  this.options = _.pick(this.options, Object.keys(events));
};

GoodWinstonReporter.prototype.init = function(readstream, emitter, callback)  {
  var self = this;

  readstream.on('data', function(data) {
    var event = data.event.replace(/\'\"/, '');
    var level = self.options[event];

    if (level != null) {
      // Ops event
      if (/ops/.test(event)) {
        var proc = data.proc;
        var os   = data.os;
        var load = data.load;

        var concurrents = 0;

        Object.keys(load.concurrents).forEach(function(key) {
          concurrents = concurrents + load.concurrents[key];
        });

        logger.log(level, format('uptime: %ss, mem: %s, %s, %s, load: %s, concurrent requests: %s',
          proc.uptime, proc.mem.rss, proc.mem.heapTotal, proc.mem.heapUsed, os.load.join(', '), concurrents));

      // Response event
      } else if (/response/.test(event)) {
        // Format message from
        logger.log(level, format('%s %s (%s) in %s ms from %s',
          data.method.toUpperCase(), data.path, data.statusCode, data.responseTime, data.source.remoteAddress));

      // Log event
      } else if (/log/.test(event)) {
        logger.log(level, format('[%s] %s',
          data.tags.join(', '), data.data));

      // Request event
      } else if (/request/.test(event)) {
        logger.log(level, format('[%s] %s',
          data.tags.join(', '), data.data));
      // Error event
      } else if (/error/.test(event)) {
        var error = data.error;
        logger.log(level, format('%s: %s',
          error.message, error.stack));
      }
    }
  });

  emitter.on('stop', function() {
    logger.warn('Server has been stopped !!!');
  });

  callback();
};

module.exports = GoodWinstonReporter;
