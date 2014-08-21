# node-event-stream-proxy

`node-event-stream-proxy` allows you to proxy an event stream most likely from a
threaded server to many consumers.

### Current status

Possibly broken, not released to `npm`, no tests.

### Usage

```javascript
var EventStreamProxy = require('event-stream-proxy'),
    streamProxy = new EventStreamProxy('http://localhost:8080/stream');

streamProxy.start();

http.createServer(function (req, res) {
  if (req.url == '/stream') {
    streamProxy.web(req, res);
  } else {
    // do something else
  };
}).listen(9000);
```

### TODO

* Add tests
