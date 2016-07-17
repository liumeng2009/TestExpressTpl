/**
 * Created by Administrator on 2016/6/27.
 */
var express = require('express');
var router = express.Router();

var userController=require('../app/controllers/apiControllers/user');
var schoolController=require('../app/controllers/apiControllers/school');
var gradeController=require('../app/controllers/apiControllers/grade');
var studentController=require('../app/controllers/apiControllers/student');

router.get('/signin',userController.signin);
router.get('/signup',userController.accesstoken,userController.signup);

router.get('/usercenter',userController.accesstoken,userController.baseInfo);

router.get('/school_list',userController.accesstoken,userController.opration,schoolController.school_list);
router.post('/school_add',userController.accesstoken,userController.opration,schoolController.new,schoolController.initRole,schoolController.initUser);
router.get('/school',userController.accesstoken,userController.opration,schoolController.school);
router.get('/school_list_all',userController.accesstoken,schoolController.school_list_all);

router.get('/grade_list_by_school',userController.accesstoken,gradeController.grade_list_by_school);

router.post('/student_add',userController.accesstoken,studentController.new);
router.get('/student_list',userController.accesstoken,studentController.list);
router.get('/student_chat_list',userController.accesstoken,studentController.chat_list);

module.exports=router;