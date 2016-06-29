/**
 * Created by Administrator on 2016/5/31.
 */
var User=require('../models/user');
var School=require('../models/school');
var Role=require('../models/role');
var Student=require('../models/student');
var Grade=require('../models/grade');
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
        isWorker:req.body.isWorker,
        nickname:req.body.nickname
    }
    if(id){
        //编辑
        User.findById({_id:id,status:true},function(err,user){
            if(err)
                return console.log(err);
            if(req.body.resetPwd){
                //点击了重置密码这个功能，将密码设定为123456
                userObj.password='123456';
                userObj.resetPwd=true;
            }
            var _user= _.extend(user,userObj);
            console.log('保存前的user是'+_user);
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

exports.delete=function(req,res){
    console.log('到达这里');
    var id=req.query.id;
    User.findOne({_id:id},function(err,user){
        if(err){
            res.json({success:0,info:'数据库读取失败'});
            return console.log(err);
        }
        console.log('1111111111111111'+user);
        //如果有工作人员的信息，则删除grade里面的users[]
        if(user.school&&user.grade&&user.role){
            Grade.findOne({status:true,_id:user.grade.toString()},function(err,grade){
                if(err){
                    res.json({success:0,info:'数据库读取失败'});
                    return console.log(err);
                }
                console.log('grade是：'+grade);
                console.log('grad1是：'+grade.users.toString());
                console.log('grad2是：'+user._id.toString());
                if(grade.users.toString().indexOf(user._id.toString())>-1){
                    console.log('符合');
                    for(var i=0;i<grade.users.length;i++){
                        if(grade.users[i].toString()===user._id.toString()){
                            grade.users.splice(i,1);
                        }
                    }
                    console.log('符合'+grade.users);
                    grade.save(function(err,grade){
                        if(err){
                            res.json({success:0,info:'数据库读取失败'});
                            return console.log(err);
                        }
                        User.update({_id:id,status:true},{$set:{status:false,school:undefined,grade:undefined,role:undefined}},function(err){
                            if(err){
                                res.json({success:0,info:'数据库读取失败'});
                                return console.log(err);
                            }
                            //用户删除之后，他的孩子们置否
                            var searchStudent=[];
                            for(var n=0;n<user.sons.length;n++){
                                searchStudent.push(user.sons[n]);
                            }
                            console.log('儿子们：'+searchStudent);
                            Student.find({status:true})
                                .where('_id')
                                .in(searchStudent)
                                .update({status:false})
                                .exec(function(err){
                                    if(err){
                                        res.json({success:0,info:'数据库读取失败'});
                                        return console.log(err);
                                    }
                                    console.log('update完成');
                                    res.json({success:1});
                                });
                        });

                    });
                }
                else{
                    res.json({success:0,info:'数据结构有误'});
                }
            })
        }
        //如果没有，那么说明这个用户不是工作人员，就直接删除，再删除他的孩子即可
        else{
            User.update({_id:id,status:true},{$set:{status:false,school:undefined,grade:undefined,role:undefined}},function(err){
               if(err){
                   res.json({success:0,info:'数据库读取失败'});
                   return console.log(err);
               }
                //用户删除之后，他的孩子们置否
                var searchStudent=[];
                for(var n=0;n<user.sons.length;n++){
                    searchStudent.push(user.sons[i]);
                }
                console.log('儿子们：'+searchStudent);
                Student.find({status:true})
                    .where('_id')
                    .in(searchStudent)
                    .update({status:false})
                    .exec(function(err,students){
                        if(err){
                            res.json({success:0,info:'数据库读取失败'});
                            return console.log(err);
                        }
                        console.log('update完成'+students);
                        res.json({success:1});
                    });
            });

        }
    })


}