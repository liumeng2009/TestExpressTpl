var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//登录
router.get('/login',function(req,res,next){
  res.render('pages/auth/login',{
    title:'请先登录'
  });
});

router.get('/admin/list',function(req,res,next){
  res.render('pages/users/admin_list',{
    title:'管理员列表'
  });
})

module.exports = router;
