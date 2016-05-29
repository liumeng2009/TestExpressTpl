var express = require('express');
var router = express.Router();
var adminUserController=require('../app/controllers/admin_user');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//登录
router.get('/login',function(req,res,next){
  var info=req.query.err;
  console.log(info);
  if(info){
    res.render('pages/auth/login',{
      title:'请先登录11111111',
      opinfo:{
        error:info
      }
    });
  }
  else{
    res.render('pages/auth/login',{
      title:'请先登录222222222'
    });
  }

});

router.get('/admin/list',adminUserController.admin_user_list);
router.post('/admin/new',adminUserController.new);
router.get('/admin',adminUserController.admin_user);
router.get('/admin/:id',adminUserController.admin_user);
router.post('/signin',adminUserController.signin);

module.exports = router;
