'use strict';

const express = require('express');
const app = express();
const rootDir = './dist/';
const CONFS = [
  ['/ar/', 'ar/'],
  ['/en/', 'en/'],
  ['/',    'he/'],
];

app.set('port', process.env.PORT || 8000);
for (const conf of CONFS) {
    const _rootDir = `${rootDir}${conf[1]}`;
    console.log(conf[0],'->',_rootDir);
    app.use(conf[0], express.static(_rootDir, {
        index: false,
        maxAge: '1d',
    }));
}
for (const conf of CONFS) {
  const _rootDir = `${rootDir}${conf[1]}`;
  app.route(conf[0] + '*')
    .get(function(req, res) {
        res.sendFile('index.html', {root: _rootDir});
    });  
  }

app.listen(app.get('port'), function() {
  console.log('Listening port ' + app.get('port'));
});
