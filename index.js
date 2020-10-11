'use strict';

const express = require('express');
const nunjucks = require('nunjucks');
const request = require("request");
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const app = express();
const rootDir = './dist/';
const externalUrl = 'https://yodaat.org';
const apiServer = 'https://api.yodaat.org';
const CONFS = [
  ['/ar/', 'ar/'],
  ['/en/', 'en/'],
  ['/',    'he/'],
];
const TITLE = 'יודעת هي تعرف she knows';
const TITLE_LANGS = {
  'he/': 'מרכז ידע נשים ומגדר',
  'en/': 'Knowledge Hub on Women and Gender',
  'ar/': 'مركز المعلومات عن النساء والجندر'
}

nunjucks.configure(rootDir, {
  autoescape: true,
  express: app
});

app.set('port', process.env.PORT || 8000);

app.get('/sitemap.xml', function(req, res) {
  res.status(301).redirect('https://api.yodaat.org/data/sitemap.xml')
});

app.use('/contact', bodyParser.json())
   .post('/contact', function(req, res) {
      const msg = {
        to: 'info@yodaat.org',
        from: 'noreply@yodaat.org',
        subject: req.body.subject,
        text: req.body.body,
        html: '<div style="direction:rtl">' + req.body.body.split('\n').join('<br/>') + '</div>',
      };
      console.log(msg);
      sgMail
        .send(msg)
        .then(() => {
          res.status(200).json({sent: true});
        })
        .catch((error) => {
          res.status(200).json({sent: false, error: '' + error});
        });
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
  const langPrefix = conf[0];
  const title = TITLE_LANGS[conf[1]];
  app.route(langPrefix + '*')
    .get(function(req, res) {
      const item_prefix = `${langPrefix}item`;
      const tag_prefix = `${langPrefix}search?tag=`;
      if (req.originalUrl.startsWith(item_prefix)) {
        const doc_id = req.path.slice(item_prefix.length + 1);
        request({
          url: apiServer + '/get/' + doc_id,
          json: true
        }, function (error, response, body) {
          console.log(error, response, body);
          if (response.statusCode === 200 && body !== null && body.value) {
            body = body.value;
            let image_url='https://yodaat.org/assets/social-preview.png';
            if (doc_id.startsWith('dataset/')) {
              image_url = `https://api.yodaat.org/data${langPrefix}${doc_id}-share.png`;
            }
            res.render(`${conf[1]}index.html`, {
              lang: conf[1].slice(0, 2),
              title: TITLE + ' - ' + (body.org_name || body.title || body.chart_title),
              image_url: image_url,
              description: title + ' - ' + (body.objective || body.notes || body.chart_abstract),
              url: `${externalUrl}${req.originalUrl}`
            })      
          }
        });
      } else if (req.originalUrl.startsWith(tag_prefix)) {
        const tag = req.query.itag || req.query.tag;
        const image_url='https://yodaat.org/assets/social-preview.png';
        res.render(`${conf[1]}index.html`, {
          lang: conf[1].slice(0, 2),
          title: TITLE + ' - ' + tag,
          image_url: image_url,
          description: title + ` - פרסומים, ארגונים ומידע הקשורים ל${tag}`,
          url: `${externalUrl}${req.originalUrl}`
        });
      } else {
        res.render(`${conf[1]}index.html`, {
          lang: conf[1].slice(0, 2),
          title: TITLE,
          image_url: 'https://yodaat.org/assets/social-preview.png',
          description: title,
          url: `${externalUrl}${req.originalUrl}`
        });  
      }
    });  
  }

app.listen(app.get('port'), function() {
  console.log('Listening port ' + app.get('port'));
});
