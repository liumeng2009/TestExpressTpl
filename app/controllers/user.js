/**
 * Created by Administrator on 2016/5/31.
 */
var User=require('../models/user');
var School=require('../models/school');
var Role=require('../models/role')
var _=require('underscore');

//用户列表
exports.user_list=function(req,res){
    User.find({status:true})
        .populate('role')
        .exec(function(err,user){
            if(err)
                return console.log(err);
            res.render('./pages/users/user_list',{
                title:'网站用户列表',
                users:user
            });
        });
}

//用户信息
exports.user=function(req,res){
    var id=req.params.id;

    if(id){
        //编辑
        User.findOne({status:true,_id:id},function(err,user){
            if(err)
                return console.log(err);
            res.render('./pages/users/user_edit',{
                title:'编辑用户',
                action:'编辑',
                user:user
            });

        });
    }
    else{
        //新增
        res.render('./pages/users/user',{
            title:'新增用户',
            action:'新增',
            user:{}
        });

    }
}

exports.new=function(req,res){
    var id=req.body.id;
    var userObj={
        name:req.body.name,
        password:req.body.password,
        phone:req.body.phone,
        email:req.body.email,
        status:true,
        isWorker:req.body.isWorker
    }
    if(id){
        //编辑
        User.findById({_id:id,status:true},function(err,user){
            if(err)
                return console.log(err);
            var _user= _.extend(user,userObj);
            _user.save(function(err,user){
                if(err)
                    return console.log(err);
                res.redirect('/admin/user/list');
            });
        })
    }
    else{
        //新增
        //检查重复用户名
        var _user=new User(userObj);
        User.findOne({name:userObj.name},function(err,user){
            if(err){
                 err.status=500;
                 res.render('error',{
                 message:err.name,
                 error:err
                 })
                 return console.log(err);
            }
            if(user){
                //有重复用户名
                res.redirect('/admin/user?err=hasname');
            }
            else{
                _user.save(function(err,user){
                    if(err){
                         err.status=500;
                         res.render('error',{
                         message:err.name,
                         error:err
                         })
                         return console.log(err);
                    }
                    res.redirect('/admin/user/list');
                });
            }
        });

    }
}