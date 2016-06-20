var express = require('express');
var router = express.Router();
var adminUserController=require('../app/controllers/admin_user');
var indexController=require('../app/controllers/index');
var userController=require('../app/controllers/user');
var schoolController=require('../app/controllers/school');
var presidentController=require('../app/controllers/president');
var gradeController=require('../app/controllers/grade');
var roleController=require('../app/controllers/role');
var functionController=require('../app/controllers/function');
var studentController=require('../app/controllers/student');

router.get('/',adminUserController.signinRequired ,indexController.index);
router.get('/login',adminUserController.showSignIn);
router.get('/admin/list',adminUserController.signinRequired ,adminUserController.admin_user_list);
router.post('/admin/new',adminUserController.signinRequired ,adminUserController.new);
router.get('/admin',adminUserController.signinRequired ,adminUserController.admin_user);
router.get('/admin/:id',adminUserController.signinRequired ,adminUserController.admin_user);
router.post('/signin',adminUserController.signin);
router.get('/signout',adminUserController.signinRequired,adminUserController.signout);

router.get('/user/list',adminUserController.signinRequired,userController.user_list);
router.get('/user',adminUserController.signinRequired,userController.user);
router.get('/user/:id',adminUserController.signinRequired,userController.user);
router.post('/user/new',adminUserController.signinRequired,userController.new);

router.get('/president/list',adminUserController.signinRequired,presidentController.president_list);
router.get('/president',adminUserController.signinRequired,presidentController.president);
router.get('/president/:id',adminUserController.signinRequired,presidentController.president);
router.post('/president/new',adminUserController.signinRequired ,presidentController.new);
router.delete('/president/list',adminUserController.signinRequired ,presidentController.del);

router.get('/school/list',adminUserController.signinRequired,schoolController.school_list);
router.get('/school',adminUserController.signinRequired,schoolController.school);
router.get('/school/:id',adminUserController.signinRequired,schoolController.school);
router.post('/school/new',adminUserController.signinRequired ,schoolController.new);
router.delete('/school/list',adminUserController.signinRequired ,schoolController.del);
router.get('/school_select',adminUserController.signinRequired,schoolController.select);

router.get('/grade/list',adminUserController.signinRequired,schoolController.validSchoolId,gradeController.grade_list);
router.get('/grade',adminUserController.signinRequired,schoolController.validSchoolId,gradeController.grade);
router.get('/grade/:id',adminUserController.signinRequired,schoolController.validSchoolId,gradeController.grade);
router.post('/grade/new',adminUserController.signinRequired,schoolController.validSchoolId,gradeController.new);
router.post('/grade/insertuser',adminUserController.signinRequired,schoolController.validSchoolId,gradeController.insertuser);

router.get('/role/list',adminUserController.signinRequired,roleController.role_list);
router.get('/role',adminUserController.signinRequired,roleController.role);
router.get('/role/:id',adminUserController.signinRequired,roleController.role);
router.post('/role/new',adminUserController.signinRequired,roleController.new);
router.get('/role/findrole/:sid',adminUserController.signinRequired,roleController.findRoleBySchool);

router.get('/function/list',adminUserController.signinRequired,functionController.function_list);
router.get('/function',adminUserController.signinRequired,functionController.function);
router.get('/function/:id',adminUserController.signinRequired,functionController.function);
router.post('/function/new',adminUserController.signinRequired,adminUserController.maxRequired,functionController.new);

router.get('/student/list',adminUserController.signinRequired,studentController.student_list)
router.get('/student',adminUserController.signinRequired,studentController.student)
router.get('/student/:id',adminUserController.signinRequired,studentController.student)
router.post('/student/new',adminUserController.signinRequired,studentController.new)
router.delete('/student/list',adminUserController.signinRequired,studentController.delete)

module.exports = router;
