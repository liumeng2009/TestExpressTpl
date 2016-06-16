/**
 * Created by Administrator on 2016/5/31.
 */
var User=require('../models/user');
var School=require('../models/school');
var Role=require('../models/role')
var _=require('underscore');

//用户列表
exports.user_list=function(req,res){
    var sid=req.query.sid;
    console.log('请求到达'+sid);
    if(sid) {
        console.log('没有到达这里吗');
        if (!sid.match(/^[0-9a-fA-F]{24}$/)) {
            var err = new Error('参数错误');
            err.status = 404;
            //next(err);
            res.render('error', {
                message: err.message,
                error: err
            });
        }
    }
    else{

    }

    School.findOne({_id:sid,status:true},function(err,school){
        if(err)
            return console.log(err);
        if(school){
            //学校存在
            console.log(school);
            User.find({status:true,school:school._id})
                .populate('school')
                .populate('role')
                .exec(function(err,user){
                    if(err)
                        return console.log(err);
                    res.render('./pages/users/user_list',{
                        title:school.name+'用户列表',
                        users:user,
                        school:school
                    });
                });
        }
        else{
            School.find({status:true})
                .populate('owner')
                .exec(function(err,schools) {
                    if (err)
                        return console.log(err);
                    res.render('./pages/users/user_list', {
                        title: '请先选择学校',
                        schools: schools
                    });
                });
        }
    });
}

//用户信息
exports.user=function(req,res){
    var id=req.query.id;

    if(id){
        //编辑
        User.findOne({status:true,_id:id},function(err,user){
            if(err)
                return console.log(err);
            Role.find({school:school._id},function(err,roles){
                if(err)
                    return console.log(err);
                res.render('./pages/users/user_edit',{
                    title:'编辑用户',
                    action:'编辑',
                    user:user,
                    sid:sid,
                    school:school,
                    roles:roles
                });
            });
        });
    }
    else{
        //新增
        School.find({status:true},function(err,schools){
            if(err)
                return console.log(err);
            res.render('./pages/users/user',{
                title:'新增用户',
                action:'新增',
                user:{},
                schools:schools
            });
        });
    }
}

exports.new=function(req,res){
    var sid=req.body.sid;
    var id=req.body.id;
    School.findById({_id:sid,status:true},function(err,school){
        if(err)
            console.log(err);
        if(school){
            Role.findById({status:true,_id:req.body.role},function(err,role){
                var userObj={
                    name:req.body.name,
                    school:school,
                    password:req.body.password,
                    phone:req.body.phone,
                    email:req.body.email,
                    role:role,
                    status:true,
                    isParent:req.body.isParent
                }
                if(id){
                    //编辑
                    console.log('编辑模式');
                    User.findById({_id:id,status:true},function(err,user){
                        if(err)
                            return console.log(err);
                        var _user= _.extend(user,userObj);
                        _user.save(function(err,user){
                            if(err)
                                return console.log(err);
                            res.redirect('/admin/user/list?sid='+school._id);
                        });
                    })
                }
                else{
                    //新增
                    var _user=new User(userObj);
                    _user.save(function(err,user){
                        if(err)
                            return console.log(err);
                        role.users.push(user);
                        role.save(function(err,role){
                            if(err)
                                return console.log(err);
                            res.redirect('/admin/user/list?sid='+school._id);
                        });
                    });
                }
            });
        }
        else{
            res.redirect('/admin/user/list?err=snotexist');
        }
    });
}