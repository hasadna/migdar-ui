'use strict';

const express = require('express');
const app = express();
const rootDir = './dist/migdar-ui/';

app.set('port', process.env.PORT || 8000);
app.use('/', express.static(rootDir, {
  index: false,
  maxAge: '1d',
}));
app.route('/*')
    .get(function(req, res) {
        res.sendFile('index.html', {root: rootDir});
    });


app.listen(app.get('port'), function() {
  console.log('Listening port ' + app.get('port'));
});
