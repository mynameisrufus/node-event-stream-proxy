'use strict';

var http = require('http'),
    EE3 = require('eventemitter3');

/**
 * EventStreamProxy construc
 * EventEmitter interface.
 *
 * @constructor
 *
 * @param {String} url of stream to proxy.
 *
 * @api public
 */
function EventStreamProxy(url) {
  this.emitter = new EE3.EventEmitter();
  this.headers = {};
  this.url = url;
}

/**
 * Subscribe to the stream.
 *
 * @param {Function} fn The listener for the event.
 * @param {Function} fn Callback for when the stream ends.
 *
 * @api public
 */
EventStreamProxy.prototype.subscribe = function(subscriber, end) {
  this.emitter.on('broadcast', subscriber);
  this.emitter.once('end', end);
};

/**
 * Un-subscribe to the stream.
 *
 * @param {Function} fn The listener to be removed.
 *
 * @api public
 */
EventStreamProxy.prototype.unsubscribe = function(subscriber) {
  this.emitter.removeListener('broadcast', subscriber);
};

/**
 * Broadcast event body to the stream.
 *
 * @param {String} body to broadcast to listners.
 *
 * @api public
 */
EventStreamProxy.prototype.broadcast = function(body) {
  this.emitter.emit('broadcast', body);
};

/**
 * Start streaming to listners.
 *
 * @api public
 */
EventStreamProxy.prototype.start = function() {
  var _self = this;
  http.get(this.url, function(res) {
    _self.headers = res.headers;
    res.on('data', function(chunk) {
      _self.broadcast(chunk + "");
    });
    res.on('end', function() {
      _self.emitter.emit('end');
      console.log("Connection closed");
      setTimeout(function() {
        _self.connect()
      }, 1000);
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
    setTimeout(function() {
      _self.connect()
    }, 1000);
  });
};

/**
 * Incoming streaming request.
 *
 * @param {ClientRequest} Req Request object
 * @param {IncomingMessage} Res Response object
 *
 * @api public
 */
EventStreamProxy.prototype.web = function(req, res) {
  _self = this;
  req.socket.setTimeout(Infinity);
  res.writeHead(200, this.headers);
  res.write('\n');
  var writer = function(event) {
    res.write(event);
  };
  this.subscribe(writer, function() {
    res.end();
  });
  req.on("close", function() {
    _self.unsubscribe(writer);
  });
};

module.exports = EventStreamProxy;
