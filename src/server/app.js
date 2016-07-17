'use strict';

const koa = require('koa');
const path = require('path');
const fs = require('fs');

const mount = require('koa-mount');
const route = require('koa-route');
const send = require('koa-send');
const serve = require('koa-static');

const app = koa();
const exec = require('child-process-promise').exec;
const Reader = require('line-by-line');
const CSEARCHROOT = process.env.CSEARCHROOT || '.';

// searches index location
process.env.CODEGREP_PORT = process.env.CODEGREP_PORT || 3000;
process.env.CSEARCHINDEX = process.env.CSEARCHINDEX || '.searchindex';

// apis
app.use(route.get('/api/search', function *() {
  const q = this.query['q'];
  if (typeof(q) !== 'string') {
    return this.status = 400;
  }

  const flags = [];

  // line number
  flags.push('-n');

  const f = this.query['f'];
  if (typeof(f) === 'string' && f !== '') {
    flags.push(`-f ${f}`);
  }

  const flag = flags.join(' ');
  const result = yield exec(`./bin/csearch ${flag} ${q} | head -n 10`);

  // removes last element because it's an empty string
  const matches = result.stdout.split(/[\r\n]+/).slice(0, -1).map(function (line) {
    const splitResult = line.split(':', 2);
    const file = splitResult[0];
    const lno = parseInt(splitResult[1], 10);
    return new Promise(function (resolve, reject) {
      let currentLine = 0;

      const reader = new Reader(file);
      const aboveLines = [];
      const belowLines = [];
      let theLine = '';

      reader.on('error', function (err) {
        reject(err);
      });
      reader.on('line', function(line) {
        currentLine += 1;
        if (currentLine < lno && currentLine + 3 >= lno) {
          aboveLines.push(line);
        } else if (currentLine == lno) {
          theLine = line;
        } else if (currentLine > lno && currentLine - 3 <= lno) {
          belowLines.push(line);
        }
      });
      reader.on('end', function() {
        resolve({
          'file': path.relative(CSEARCHROOT, file),
          'lno': lno,
          'above_lines': aboveLines,
          'below_lines': belowLines,
          'the_line': theLine,
        });
      });
    });
  });

  this.body = yield Promise.all(matches);
}));

app.use(route.get('/api/file', function *() {
  const f = this.query['f'];
  if (typeof(f) !== 'string') {
    return this.status = 400;
  }
  yield send(this, f);
}));

app.use(route.get('/api/lastupdate', function *() {
  this.body = yield new Promise(function (resolve, reject) {
    fs.stat(process.env.CSEARCHINDEX, function (error, stats) {
      if (error) {
        return reject(error);
      }
      resolve(stats.mtime);
    });
  });
}));

// serves static assets
app.use(mount('/public', serve('./public')));

// catches all
app.use(function *() {
  if (this.path !== '/') {
    return this.redirect('/');
  }
  yield send(this, './src/client/index.html');
});

// listens to the port
app.listen(3000);
