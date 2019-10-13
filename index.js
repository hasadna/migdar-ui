'use strict';

const express = require('express');
const nunjucks = require('nunjucks');
const request = require("request");

const app = express();
const rootDir = './dist/';
const externalUrl = 'https://yodaat.org';
const apiServer = 'https://api.yodaat.org';
const CONFS = [
  ['/ar/', 'ar/'],
  ['/en/', 'en/'],
  ['/',    'he/'],
];

nunjucks.configure(rootDir, {
  autoescape: true,
  express: app
});

app.set('port', process.env.PORT || 8000);

app.get('/sitemap.xml', function(req, res) {
  res.status(301).redirect('https://api.yodaat.org/data/sitemap.xml')
});

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
      const item_prefix = `${conf[0]}item`;
      if (req.originalUrl.startsWith(item_prefix)) {
        const doc_id = req.path.slice(item_prefix.length+1);
        console.log('FETCHING', doc_id);
        request({
          url: apiServer + '/get/' + doc_id,
          json: true
        }, function (error, response, body) {
          console.log(error, response, body);
          if (response.statusCode === 200 && body !== null && body.value) {
            body = body.value;
            res.render(`${conf[1]}index.html`, {
              lang: conf[1].slice(0, 2),
              title: 'יודעת - ' + (body.org_name || body.title || body.chart_title),
              image_url: 'https://yodaat.org/assets/social-preview.png',
              description: body.objective || body.notes || body.chart_abstract,
              url: `${externalUrl}${req.originalUrl}`
            })      
          }
        });
      } else {
        res.render(`${conf[1]}index.html`, {
          lang: conf[1].slice(0, 2),
          title: 'יודעת هي تعرف she knows',
          image_url: 'https://yodaat.org/assets/social-preview.png',
          description: 'מרכז ידע בנושא נשים ומגדר בישראל',
          url: `${externalUrl}${req.originalUrl}`
        });  
      }
    });  
  }

app.listen(app.get('port'), function() {
  console.log('Listening port ' + app.get('port'));
});
