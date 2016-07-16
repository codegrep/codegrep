const koa = require('koa');
const mount = require('koa-mount');
const send = require('koa-send');
const static = require('koa-static');

const app = koa();

// apis
// app.use(mount('/'))

// serves static assets
app.use(mount('/public', static('./public')));

// catch all by serving static index
app.use(function *() {
  if (this.path !== '/') {
    return this.redirect('/');
  }
  yield send(this, './src/client/index.html');
});

// listens to the port
app.listen(3000);
