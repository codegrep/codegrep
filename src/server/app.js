const koa = require('koa');

const mount = require('koa-mount');
const route = require('koa-route');
const send = require('koa-send');
const static = require('koa-static');

const app = koa();
const exec = require('child-process-promise').exec;

// search index location
process.env.CODEGREP_PORT = process.env.CODEGREP_PORT || 3000;
process.env.CSEARCHINDEX = process.env.CSEARCHINDEX || '.searchindex';

// apis
app.use(route.get('/api/search', function *() {
  const q = this.query['q'];
  if (typeof(q) !== 'string') {
    return this.status = 400;
  }
  const result = yield exec(`./bin/csearch ${q} | head -n 10`);
  this.body = result.stdout;
}))

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
