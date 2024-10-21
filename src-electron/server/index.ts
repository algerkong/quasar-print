import { createServer } from './httpServer';
import { IncomingMessage, } from 'http';
import { URL } from 'url';

interface User {
  id: number;
  name: string;
  email: string;
}

// 模拟数据库
const users: User[] = [
  { id: 1, name: '张三', email: 'aaaaa@163.com' },
  { id: 2, name: '李四', email: 'bbbb@qq.com' },
];

function getQueryParams(req: IncomingMessage): URLSearchParams {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  return url.searchParams;
}

const startServer = ()=>{
  return createServer({
    port: 2333,
    routes: {
      '/': (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('服务启动');
      },

      '/api/users': (req, res) => {
        if (req.method === 'GET') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(users));
        } else if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            const newUser: User = JSON.parse(body);
            newUser.id = users.length + 1;
            users.push(newUser);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));
          });
        } else {
          res.writeHead(405, { 'Content-Type': 'text/plain' });
          res.end('请求错误');
        }
      },

      '/api/users/': (req, res) => {
        if (req.method === 'GET') {
          const params = getQueryParams(req);
          const id = parseInt(params.get('id') || '');
          const user = users.find(u => u.id === id);
          if (user) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
          } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('用户找不到');
          }
        } else {
          res.writeHead(405, { 'Content-Type': 'text/plain' });
          res.end('请求错误');
        }
      },

      '/api/time': (req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ currentTime: new Date().toISOString() }));
      }
    }
  });
}

export default startServer;
