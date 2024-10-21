import http from 'http';

type RouteHandler = (req: http.IncomingMessage, res: http.ServerResponse) => void;

interface ServerOptions {
  port: number;
  routes: { [path: string]: RouteHandler };
}

export function createServer(options: ServerOptions): http.Server {
  const { port, routes } = options;

  const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const url = req.url || '/';
    const handler = routes[url];
    if (req.method === 'OPTIONS') {
      // 设置预检请求的响应状态码为 204 (No Content)
      res.writeHead(204);
      res.end();
      return;
  }

    if (handler) {
      handler(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  });

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  return server;
}
