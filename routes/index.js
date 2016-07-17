var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('网站前台首页');
});
router.get('/chat.html', function(req, res, next) {
    res.render('chat', { title: 'Chat' });
});

module.exports = router;
