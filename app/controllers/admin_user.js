/**
 * Created by Administrator on 2016/5/26.
 */
var mongoose=require('mongoose');
var AdminUser=require('../models/admin_user');
var Chat=require('../models/chat');
var _ = require('underscore')

//用户列表
exports.admin_user_list=function(req,res){
    AdminUser.fetch(function(err,adminUsers){
        if(err){
            console.log(err);
        }
        else{
            res.render('./pages/users/admin_list',{
                title:'管理员列表',
                admin_users:adminUsers
            });
        }
    });
}
//用户信息
exports.admin_user=function(req,res){
    var id=req.query.id;
    AdminUser.findById({_id:id},function(err,adminUser){
        console.log('参数是:'+adminUser);
        if(adminUser){
            res.render('./pages/users/admin_edit',{
                title:'编辑管理员',
                admin_user:adminUser,
                action:'编辑'
            });
        }
        else{
            res.render('./pages/users/admin',{
                title:'新增管理员',
                admin_user:[],
                action:'新增'
            });
        }
    });
}
//新增用户
exports.new=function(req,res){
    var id=req.body._id;
    var adminUserObj={
        name:req.body.name,
        password:req.body.password,
        weight:req.body.weight,
        status:true,
        phone:req.body.phone,
        email:req.body.email
    };
    //id存在就是编辑 不存在就是新增
    if(id){
        AdminUser.findById({_id:id},function(err,adminuser) {
            if (err)
                return console.log(err);

            //编辑页面，name属性不可修改，所以删除掉
            delete adminUserObj.name;
            delete adminUserObj.password;

            var _adminuser = _.extend(adminuser, adminUserObj);
            _adminuser.save(function (err, adminuser) {
                if (err) {
                    res.redirect(req.url);
                }
                else {
                    res.redirect('/admin/admin/list');
                }
            });
        });
    }
    else{
        AdminUser.find({name:adminUserObj.name},function(err,adminuser){
            if(err){
                console.log(err);
            }
            else{
                console.log('这个对象是：'+adminuser);
                if(adminuser&&adminuser.length>0){
                    res.redirect('/admin/admin?err=exist');
                }else{
                    var _adminuser=new AdminUser(adminUserObj);
                    _adminuser.save(function(err,user){
                        if(err){
                            console.log(err);
                        }
                        else{

                            res.redirect('/admin/admin/list');
                        }
                    });
                }
            }
        });
    }
}

// 登录
exports.signin = function(req, res) {
    var name = req.body.name;
    var password = req.body.password;
    AdminUser.findOne({name: name}, function(err, user) {
        /*
        if (err) {
            console.log(err);
        }
        */
        if (!user) {
            res.redirect('./login?err=notexist');
        }
        else{
            user.comparePassword(password,user.password, function(err, isMatch) {
                if (err) {
                    console.log(err);
                }
                console.log('正确吗？'+isMatch)
                if (isMatch) {
                    req.session.user = user
                    res.redirect('/admin');
                }
                else {
                    res.redirect('/admin/login?err=wrong');
                }
            });
        }
    })
}
// 登出
exports.signout=function(req,res){
    delete req.session.user;
    res.redirect('/admin/login');
}

//登录界面
exports.showSignIn=function(req,res){
    res.render('pages/auth/login',{
        title:'请先登录'
    });

}

//删除用户
exports.del=function(req,res){
    var id=req.query.id;
    if(id){
        console.log('删除的id是:'+id);
        AdminUser.update({_id:id},{$set:{status:false}},function(err){
            if(err){
                res.send(err+'错误');
            }
            else{
                res.json({success:1});
            }
        });
    }
}

//user 中间件
//mid ware for user
exports.signinRequired=function(req,res,next){
    var user=req.session.user;

    if(!user){
        res.redirect('/admin/login');
    }
    else{
        AdminUser.findById({_id:user._id},function(err,adminuser){
            if(err)
                console.log(err);
            if(adminuser){
                console.log('3333333333333333');
                next();
            }
            else{
                res.redirect('/admin/login?err=wrong');
            }
        });
    }
}

exports.maxRequired=function(req,res,next){
    var user=req.session.user;
    if(user.weight===999){
        console.log('到这里了，权限正确');
    }
    else{
        var err = new Error('拒绝访问');
        err.status = 403;
        err.message='您没有权限访问此功能';
        next(err);
    }
    next();
}

