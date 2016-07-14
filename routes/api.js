/**
 * Created by Administrator on 2016/6/27.
 */
var express = require('express');
var router = express.Router();

var userController=require('../app/controllers/apiControllers/user');
var schoolController=require('../app/controllers/apiControllers/school');

router.get('/signin',userController.signin);
router.get('/signup',userController.accesstoken,userController.signup);

router.get('/usercenter',userController.accesstoken,userController.baseInfo);

router.get('/school_list',userController.accesstoken,userController.opration,schoolController.school_list);
router.post('/school_add',userController.accesstoken,userController.opration,schoolController.new,schoolController.initRole,schoolController.initUser);
router.get('/school',userController.accesstoken,userController.opration,schoolController.school);

module.exports=router;