var express = require('express');
var router = express.Router();
var adminUserController=require('../app/controllers/admin_user');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//登录
router.get('/login',function(req,res,next){
  res.render('pages/auth/login',{
    title:'请先登录'
  });
});

router.get('/admin/list',adminUserController.admin_user_list);
router.get('/admin/new',adminUserController.new);
router.get('/admin',adminUserController.admin_user);
router.get('/admin/:id',adminUserController.admin_user);

module.exports = router;
