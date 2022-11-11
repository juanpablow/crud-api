const http = require('http');
const url = require('url');

const bodyParser = require('./helpers/bodyParser');
const routes = require('./routes');

const server = http.createServer((request, response) => {
  const parsedUrl = url.parse(request.url, true);
  console.log(parsedUrl);

  let { pathname } = parsedUrl;
  let id = null;

  const splitEndpoint = pathname.split('/').filter(Boolean);
  
  if (splitEndpoint.length > 1) {
    pathname = `/${splitEndpoint[0]}/:id`;
    id = splitEndpoint[1];
  }

  console.log(`Request method: ${request.method} | Endpoint: ${parsedUrl.pathname}`);

  // ".find" method iterate
  const route = routes.find((routeObj) => (
    routeObj.endpoint === pathname && routeObj.method === request.method
  ));

  if (route) {
    request.query = parsedUrl.query;
    request.params = { id };

    response.send = (statusCode, body) => {
      response.writeHead(statusCode, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(body));
    };

    if(['POST', 'PUT', 'PATCH'].includes(request.method)) {
      bodyParser(request, () => route.handler(request, response));
    } else {
      route.handler(request, response);
    }

  } else {
    response.writeHead(404, { 'Content-Type': 'text/html' });
    response.end(`Cannot ${request.method} ${parsedUrl.pathname}`)
  }
});

server.listen(3000, () => console.log('Server started at htttp://localhost:3000'));


//////////////// ANOTHER WAY ///////////////////////////////

// const http = require('http');
// const { URL } = require('url');

// const routes = require('./routes');

// const server = http.createServer((request, response) => {
//   const parsedUrl = new URL(`http://localhost:3000${request.url}`);
//   console.log(parsedUrl);

//   console.log(`Request method: ${request.method} | Endpoint: ${parsedUrl.pathname}`);

//   // ".find" method iterate
//   const route = routes.find((routeObj) => (
//     routeObj.endpoint === parsedUrl.pathname && routeObj.method === request.method
//   ));

//   if (route) {
//     request.query = Object.fromEntries(parsedUrl.searchParams);
//     route.handler(request, response);
//   } else {
//     response.writeHead(404, { 'Content-Type': 'text/html' });
//     response.end(`Cannot ${request.method} ${parsedUrl.pathname}`)
//   }

//   // if (parsedUrl.pathname === '/users' && request.method === 'GET') {

//   // } else {
//   //   response.writeHead(404, { 'Content-Type': 'text/html' });
//   //   response.end(`Cannot ${request.method} ${request.url}`);
//   // }

//   // response.writeHead(200, { 'Content-Type': 'text/html' });
//   // response.end('<h1>Hello World! </h1>');
// });

// server.listen(3000, () => console.log('Server started att htttp://localhost:3000'));
