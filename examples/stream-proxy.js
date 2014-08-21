var EventStreamProxy = require('event-stream-proxy'),
    httpProxy = require('http-proxy'),
    streamProxy = new EventStreamProxy('http://localhost:8080/stream'),
    proxy = httpProxy.createProxyServer({});

streamProxy.start();

http.createServer(function (req, res) {
  if (req.url == '/stream') {
    console.log("EventStreamProxy");
    streamProxy.web(req, res);
  } else {
    console.log("httpProxy");
    proxy.web(req, res, { target: 'http://localhost:8080' });
  };
}).listen(8081);
