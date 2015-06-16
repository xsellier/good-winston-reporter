# good-winston-reporter

A new reporter for [good](https://github.com/hapijs/good), that uses [winston](https://github.com/winstonjs/winston).

### Settings

#### How to set log level

Use the **event** as **key**, and the **level** as **value**

```node
var options = {
  opsInterval  : 5000,
  reporters    : [{
    reporter   : GoodWinstonReporter,
    events     : {
      log      : 'info',
      request  : 'debug',
      response : 'debug',
      error    : 'error',
      ops      : 'verbose'
    },
    config     : {
      logger   : winston
    }
  }]
};
```

#### How to set default log level

Set **'*'** as **value** for an event.

```node
var defaultOptions = {
  log      : 'info',
  request  : 'debug',
  response : 'debug',
  error    : 'error',
  ops      : 'silly'
};
```

#### Skip event type

To skip an event, you just have to not include it when you load the plugin.

##### Example

It will keep only ops and error

```node
var defaultOptions = {
  error    : 'error',
  ops      : 'silly'
};
```

#### Available logs level

Same as winston levels, but you can't enforce custom levels _(currently)_:

__silly__, __debug__, __verbose__, __info__, __warn__, __error__

### Get started

Here a piece of code to help you integrate this module into your pretty [Hapi](https://github.com/hapijs/hapi) server.

```node
'use strict';

var Hapi                = require('hapi');
var winston             = require('winston');
var server              = new Hapi.Server();
var GoodWinstonReporter = require('good-winston-reporter');

server.connection({ host: 'localhost', port: 3000 });

var options = {
  opsInterval  : 5000,
  reporters    : [{
    reporter   : GoodWinstonReporter,
    events     : {
      log      : 'info',
      request  : '*', // will use default level
      response : '*', // will use default level
      error    : 'error',
      ops      : 'verbose'
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
    winston.error(err);
  }
  else {
    server.start(function () {
      winston.info('Server started at ' + server.info.uri);
    });
  }
});
```
