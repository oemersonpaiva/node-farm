const fs = require('fs');
const http = require('http');

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

const replaceTemplate = (template, product) => {
  let output = template.replace(/{%PRODUCT_NAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  }

  return output;
};

const server = http.createServer((req, res) => {
  const {url} = req;

  if (url === '/' || url === 'overview') {
    res.writeHead(200, {'Content-type': 'text/html'});

    const cardsHtml = productData
      .map((product) => replaceTemplate(cardTemplate, product))
      .join('');

    const output = overviewTemplate.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
    res.end(output);
  } else if (url === '/product') {
    res.end('Product!');
  } else if (url === '/api') {
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
