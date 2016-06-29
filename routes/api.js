/**
 * Created by Administrator on 2016/6/27.
 */
var express = require('express');
var router = express.Router();

var userController=require('../app/controllers/apiControllers/user');

router.get('/signin',userController.signin);
router.get('/signup',userController.accesstoken,userController.signup);

module.exports=router;