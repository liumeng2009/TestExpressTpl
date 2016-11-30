/**
 * Created by Administrator on 2016/6/27.
 */
var express = require('express');
var router = express.Router();

var userController=require('../app/controllers/apiControllers/user');
var schoolController=require('../app/controllers/apiControllers/school');
var gradeController=require('../app/controllers/apiControllers/grade');
var studentController=require('../app/controllers/apiControllers/student');
var chatController=require('../app/controllers/apiControllers/chat');

router.get('/signin',userController.signin);
router.post('/signup',userController.signup);
router.get('/setdeviceid',userController.setDeviceId);

router.get('/usercenter',userController.accesstoken,userController.baseInfo);
router.get('/user_by_id',userController.accesstoken,userController.user_by_id);
router.post('/check_online',userController.accesstoken,userController.check_online);

router.get('/school_list',userController.accesstoken,userController.opration,schoolController.school_list);
router.post('/school_add',userController.accesstoken,userController.opration,schoolController.new,schoolController.initRole,schoolController.initUser);
router.get('/school',userController.accesstoken,userController.opration,schoolController.school);
router.get('/school_list_all',userController.accesstoken,schoolController.school_list_all);

router.get('/grade_list_by_school',userController.accesstoken,gradeController.grade_list_by_school);

router.post('/student_add',userController.accesstoken,studentController.new);
router.get('/student_list',userController.accesstoken,studentController.list);
router.get('/student_chat_list',userController.accesstoken,studentController.chat_list);

router.get('/chat_list',userController.accesstoken,chatController.chat_list);
router.get('/chat_not_read_list',userController.accesstoken,chatController.chat_not_read_list);
router.get('/chat_not_read_list_to',userController.accesstoken,chatController.chat_not_read_list_to);
router.get('/chat_twelve_hours_ago',userController.accesstoken,chatController.chat_twelve_hours_ago);
router.get('/chat_set_new_device',userController.accesstoken,chatController.chat_set_new_device)

module.exports=router;