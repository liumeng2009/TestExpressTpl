var express = require('express');
var router = express.Router();
var getui=require('../app/controllers/getui');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('网站前台首页');
});
router.get('/chat', function(req, res, next) {
    res.render('chat', {
        title: 'Chat'
    });
});

router.get('/chat/send',getui.send);

module.exports = router;
