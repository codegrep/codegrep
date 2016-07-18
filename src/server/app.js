'use strict';

const koa = require('koa');
const path = require('path');
const fs = require('fs');
const md5 = require('md5');

const bodyParser = require('koa-bodyparser');
const mount = require('koa-mount');
const route = require('koa-route');
const send = require('koa-send');
const serve = require('koa-static');

const app = koa();
const exec = require('child-process-promise').exec;
const shellescape = require('shell-escape');
const Reader = require('line-by-line');
const CronJob = require('cron').CronJob;
const CSEARCHROOT = process.env.CSEARCHROOT || '.';

// searches index location
process.env.CODEGREP_PORT = process.env.CODEGREP_PORT || 3000;
process.env.CSEARCHINDEX = process.env.CSEARCHINDEX || '.searchindex';

// update searchindex every hour
new CronJob('00 00 * * * *', function() {
  exec('bin/cindex').then(function () {
    console.log('[spawn] reindexing succeeds at', new Date());
  }, function(err) {
    console.log('[spawn] reindexing fails with error', err);
  })
}, null, true);

// apis
app.use(bodyParser());

app.use(route.post('/api/search', function *() {
  console.log(this.request.body.hashes);

  const q = this.query['q'];
  if (typeof(q) !== 'string') {
    return this.status = 400;
  }

  const args = [];

  // search binary
  args.push('bin/csearch');

  // file
  const f = this.query['f'];
  if (typeof(f) === 'string' && f !== '') {
    args.push('-f')
    args.push(f);
  }

  // case sensitive (insensitive by default)
  const isCaseSensitive = this.query['isCaseSensitive'];
  if (!(typeof(isCaseSensitive) === 'string' && isCaseSensitive == 'true')) {
    args.push(`-i`);
  }

  // query
  if (q === '' && typeof(f) === 'string' && f !== '') {
    // only search by file name
    args.push('-l')
    args.push('.');
  } else {
    // search also for line number
    args.push('-n');
    args.push(q);
  }

  const cmd = shellescape(args);
  const result = yield exec(`${cmd} | head -n 10`);

  // removes last element because it's an empty string
  const matches = result.stdout.split(/[\r\n]+/).slice(0, -1).map(function (resultLine) {
    const splitResult = resultLine.split(':', 2);
    const file = splitResult[0];
    const lno = parseInt(splitResult[1], 10) || 1;
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
          'hash': md5(resultLine),
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
  yield send(this, f, {root: CSEARCHROOT});
}));

app.use(route.get('/api/lastupdate', function *() {
  this.body = yield new Promise(function (resolve, reject) {
    fs.stat(process.env.CSEARCHINDEX, function (err, stats) {
      if (err) {
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
