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
const spawn = require('child_process').spawn;
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
  const q = this.query['q'];
  if (typeof(q) !== 'string') {
    return this.status = 400;
  }

  const args = [];

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
  } else if (q !== '') {
    // search also for line number
    args.push('-n');
    args.push(q);
  } else {
    return this.body = [];
  }

  const h = this.request.body.hashes;
  const hashes = Array.isArray(h) ? h : [];
  const result = yield new Promise(function (resolve, reject) {
    let promissCalled = false;
    const searchProcess = spawn('bin/csearch', args);

    const lines = []
    let currentData = '';
    searchProcess.stdout.on('data', function(data) {
      currentData += data.toString();

      const chunks = currentData.split(/\n/);
      chunks.forEach(function(chunk, i) {
        if (i < chunks.length - 1) {
          const hash = md5(chunk);
          if (chunk !== '' && hashes.indexOf(hash) === -1) {
            lines.push({
              hash: hash,
              line: chunk,
            });
          }
        } else {
          currentData = chunk;
        }
      });

      if (lines.length >= 10) {
        promissCalled = true;
        searchProcess.kill();
        resolve(lines.slice(0, 10));
      }
    });

    searchProcess.on('close', function(code) {
      if (!promissCalled) {
        promissCalled = true;
        resolve(lines);
      }
    });
  });

  // removes last element because it's an empty string
  const matches = result.map(function (resultObject) {
    const resultLine = resultObject.line;
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
          'hash': resultObject.hash,
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
