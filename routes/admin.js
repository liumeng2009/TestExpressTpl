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

router.get('/',adminUserController.signinRequired ,indexController.index);
router.get('/login',adminUserController.showSignIn);
router.get('/admin/list',adminUserController.signinRequired ,adminUserController.admin_user_list);
router.post('/admin/new',adminUserController.signinRequired ,adminUserController.maxRequired,adminUserController.new);
router.get('/admin',adminUserController.signinRequired ,adminUserController.admin_user);
router.get('/admin/:id',adminUserController.signinRequired ,adminUserController.admin_user);
router.post('/signin',adminUserController.signin);
router.get('/signout',adminUserController.signinRequired,adminUserController.signout);

router.get('/user/list',adminUserController.signinRequired,userController.user_list);

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

router.get('/grade/list',adminUserController.signinRequired,gradeController.grade_list);
router.get('/grade',adminUserController.signinRequired,gradeController.grade);

router.get('/role/list',adminUserController.signinRequired,roleController.role_list);
router.get('/role',adminUserController.signinRequired,roleController.role);
router.get('/role/:id',adminUserController.signinRequired,roleController.role);
router.post('/role/new',adminUserController.signinRequired,roleController.new);

router.get('/function/list',adminUserController.signinRequired,functionController.function_list);
router.get('/function',adminUserController.signinRequired,functionController.function);
router.get('/function/:id',adminUserController.signinRequired,functionController.function);
router.post('/function/new',adminUserController.signinRequired,adminUserController.maxRequired,functionController.new);

module.exports = router;
