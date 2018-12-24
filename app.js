const Koa = require('koa');

const routes = require('./Middleware/routes');

const port = 3188;

const app = new Koa();

app.use(routes('./routes'))

// app.listen(port, () => {
//   console.log("http://localhost:" + port);
// });
