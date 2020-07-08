const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

const overviewTemplate = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  'utf-8'
);
const productTemplate = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  'utf-8'
);
const cardTemplate = fs.readFileSync(
  `${__dirname}/templates/card.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const productData = JSON.parse(data);

const server = http.createServer((req, res) => {
  const {query, pathname} = url.parse(req.url, true);

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {'Content-type': 'text/html'});

    const cardsHtml = productData
      .map((product) => replaceTemplate(cardTemplate, product))
      .join('');

    const output = overviewTemplate.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
    res.end(output);
  } else if (pathname === '/product') {
    res.writeHead(200, {'Content-type': 'text/html'});
    const product = productData[query.id];
    const output = replaceTemplate(productTemplate, product);
    res.end(output);
  } else if (pathname === '/api') {
    res.writeHead(200, {'Content-type': 'application/json'});
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    res.end('<h1>NOT Found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log("We'are online!");
});
