/**
 * Created by Administrator on 2016/5/31.
 */
var User=require('../models/user');
var School=require('../models/school');
var Role=require('../models/role');
var Student=require('../models/student');
var Grade=require('../models/grade');
var _=require('underscore');
var Mongoose=require('mongoose');

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
        User.findOne({status:true,_id:id})
            .populate({
                path:'roles.role',
                populate:{
                    path:'school'
                }
            })
            .populate({
                path:'roles.grade'
            })
            .exec(function(err,user){
                if(err){
                    err.status = 500;
                    res.render('error', {
                        message: err.name,
                        error: err
                    })
                    return console.log(err);
                }
                School.find({status:true},function(err,schools){
                    if(err){
                        err.status = 500;
                        res.render('error', {
                            message: err.name,
                            error: err
                        })
                        return console.log(err);
                    }
                    console.log('用户信息是'+user);
                    res.render('./pages/users/user_edit',{
                        title:'编辑用户',
                        action:'编辑',
                        user:user,
                        schools:schools
                    });
                })
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
        isPresident:req.body.isPresident,
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
            //如果isPresident=false,需要检查一下，他的名下是否有学校，如果有学校，则不允许删除
            School.findOne({status:true,owner:user._id},function(err,school){
                if(err){
                    err.status=500;
                    res.render('error',{
                        message:err.name,
                        error:err
                    })
                    return console.log(err);
                }
                if(school){
                    //他名下有学校，则不能删除了

                }
                else{

                }
            });

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
    var id=req.query.id;
    console.log('查询id是'+id);
    /*
    School.find({status:true})
        .update({},{$pull:{"users":Mongoose.Types.ObjectId(id)}},function(err,schools){
            console.log('schools是'+schools);
        })
    */
    if(isValidObjectId(id)){
        User.findOne({status:true,_id:id})
            .populate('sons')
            .exec(function(err,user){
                if(err){
                    res.json({success:0,info:'数据库连接错误'});
                    return console.log(err);
                }
                if(user){
                    //检查学校的users是否有这个user
                    if(user.roles.length>0){
                        //说明还有身份存在，所以不支持删除
                        return res.json({success:0,info:'这个用户还存在角色，请进入编辑页面，删除角色后再删除用户'});
                    }
                    else{
                        user.status=false;
                        user.save(function(err,user){
                            if(err){
                                res.json({success:0,info:'数据库连接错误'})
                                return console.log(err);
                            }
                            //将他的孩子全部置否
                            Student
                                .find({status:true})
                                .setOptions({multi:true})
                                .update({parent:user._id,status:true},{$set:{status:false}},function(err){
                                    if(err){
                                        res.json({success:0,info:'数据库连接错误'})
                                        return console.log(err);
                                    }
                                    res.json({success:1});
                                });
                        });
                    }
                }
                else{
                    return res.json({success:0,info:'参数错误，请刷新页面后再次尝试'});
                }
            })

    }
    else{
        return res.json({success:0,info:'参数错误，请刷新页面后再次尝试'});
    }

/*


    User.findOne({status:true,_id:id})
        .populate('roles')
        .exec(function(err,user){
            if(err){
                res.json({success:0,info:'数据库读取失败'});
                return console.log(err);
            }
            var schoolOR=[];
            for(var i=0;i<user.roles.length;i++){
                var s={_id:user.roles[i].school.toString()}
                schoolOR.push(s);
            }
            School.find({status:true})
                .or(schoolOR)
                .exec(function(err,schools){

                });
        });



    User.findOne({_id:id},function(err,user){
        if(err){
            res.json({success:0,info:'数据库读取失败'});
            return console.log(err);
        }



        //如果有工作人员的信息，则删除grade里面的users[]
        if(user.school&&user.grade&&user.role){
            Grade.findOne({status:true,_id:user.grade.toString()},function(err,grade){
                if(err){
                    res.json({success:0,info:'数据库读取失败'});
                    return console.log(err);
                }
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
*/

}

exports.select_role_grade=function(req,res){
    var sid=req.query.sid;
    console.log('111111111111111111'+sid);
    Grade.find({status:true,school:sid},function(err,grade){
        if(err){
            res.json({success:0,info:'数据库读取失败'});
            return console.log(err);
        }
        Role.find({status:true,school:sid},function(err,role){
            if(err){
                res.json({success:0,info:'数据库读取失败'});
                return console.log(err);
            }
            res.json({success:1,grade:grade,role:role});
        })
    })
}

exports.insertrole=function(req,res){
    var userid=req.body.user_id;
    var schoolid=req.body.schoolModal;
    var roleid=req.body.roleModal;
    var gradeid=req.body.gradeModal;
    School.findOne({status:true,_id:schoolid},function(err,school){
        if(err){
            err.status=500;
            res.render('error',{
                message:err.name,
                error:err
            })
            return console.log(err);
        }
        if(school){
            Role.findOne({status:true,_id:roleid},function(err,role){
                if(err){
                    err.status=500;
                    res.render('error',{
                        message:err.name,
                        error:err
                    })
                    return console.log(err);
                }
                if(role){
                    //role和school都存在时，将role的id存入user的roles中
                    User.findOne({status:true,_id:userid},function(err,user){
                       if(err){
                           err.status=500;
                           res.render('error',{
                               message:err.name,
                               error:err
                           })
                           return console.log(err);
                       }
                        if(user){
                            if(user.roles){

                            }
                            else{
                                user.roles=[];
                            }

                            Grade.findOne({status:true,_id:gradeid},function(err,grade){
                                if(err){
                                    err.status=500;
                                    res.render('error',{
                                        message:err.name,
                                        error:err
                                    })
                                    return console.log(err);
                                }
                                if(grade){
                                    var _role={grade:grade,role:role};
                                    if(user.roles){

                                    }
                                    else{
                                        user.roles=[];
                                    }
                                    user.roles.push(_role);
                                    user.save(function(err,user){
                                        if(err){
                                            err.status=500;
                                            res.render('error',{
                                                message:err.name,
                                                error:err
                                            })
                                            return console.log(err);
                                        }
                                        if(school.users){

                                        }
                                        else{
                                            school.users=[];
                                        }
                                        school.users.push(user);
                                        school.save(function(err,school){
                                            if(err){
                                                err.status=500;
                                                res.render('error',{
                                                    message:err.name,
                                                    error:err
                                                })
                                                return console.log(err);
                                            }

                                        })



                                        //将user存入grade的users列
                                        if(grade.users){

                                        }
                                        else{
                                            grade.users=[];
                                        }
                                        grade.users.push(user);
                                        grade.save(function(err,grade){
                                            if(err){
                                                err.status=500;
                                                res.render('error',{
                                                    message:err.name,
                                                    error:err
                                                })
                                                return console.log(err);
                                            }
                                            res.redirect('/admin/user/'+userid)
                                        });
                                    });
                                }
                                else{
                                    res.redirect('/admin/user/'+userid+'?err=wrongparams');
                                }
                            });

                        }
                        else{
                            res.redirect('/admin/user/'+userid+'?err=wrongparams');
                        }
                    });

                }
                else{
                    res.redirect('/admin/user/'+userid+'?err=wrongparams');
                }
            })
        }
        else{
            res.redirect('/admin/user/'+userid+'?err=wrongparams');
        }
    })
}

exports.deleterole=function(req,res){
    var roleid=req.query.id;
    var userid=req.query.userid;
    var gradeid=req.query.gradeid;
    var objid=req.query.objid;
    console.log(isValidObjectId(roleid));
    console.log(isValidObjectId(userid));
    if(isValidObjectId(roleid)&&isValidObjectId(userid)){

    }
    else{
        return res.json({success:0,info:'参数错误，尝试刷新页面重试'});
    }
    User.findOne({status:true,_id:userid},function(err,user){
        if(err){
            res.json({success:0,info:'数据库读取失败'});
            return console.log(err);
        }
        console.log('user'+user);
        if(user){
            Role.findOne({status:true,_id:roleid},function(err,role){
                if(err){
                    res.json({success:0,info:'数据库读取失败'});
                    return console.log(err);
                }
                console.log('role='+roleid+role);
                if(role){
                    School.findOne({status:true,_id:role.school.toString()},function(err,school){
                        if(err){
                            res.json({success:0,info:'数据库读取失败'});
                            return console.log(err);
                        }
                        if(school){
                            //去掉user里面的roles 删除的是一个对象[grade:{},role:{},_id:{}]
                            console.log('ccccccccccccccccccccccccc'+objid);
                            console.log('ddddddd'+user.roles.toString());
                            if(user.roles&&user.roles.toString().indexOf(objid)>-1){
                                console.log('eeeeeeeeeeeeeeeeee');
                                for(var i=0;i<user.roles.length;i++){
                                    console.log('fffffffffffff'+i);
                                    console.log('aaaa'+user.roles[i]._id.toString());
                                    console.log('bbbb'+objid.toString());
                                    if(user.roles[i]._id.toString()===objid.toString()){
                                        user.roles.splice(i,1);
                                        break;
                                    }
                                }
                            }
                            user.save(function(err,user){
                                if(err){
                                    res.json({success:0,info:'数据库读取失败'});
                                    return console.log(err);
                                }
                                //去掉school里面的users
                                if(school.users&&school.users.toString().indexOf(user._id.toString())>-1){
                                    for(var i=0;i<school.users.length;i++){
                                        if(school.users[i].toString()===user._id.toString()){
                                            school.users.splice(i,1);
                                            break;
                                        }
                                    }
                                    school.save(function(err,school){
                                        if(err){
                                            res.json({success:0,info:'数据库读取失败'});
                                            return console.log(err);
                                        }
                                        console.log('school'+school);
                                        //还需要去掉grade里面的users
                                        if(isValidObjectId(gradeid)){
                                            Grade.findOne({status:true,_id:gradeid},function(err,grade){
                                                if(err){
                                                    res.json({success:0,info:'数据库读取失败'});
                                                    return console.log(err);
                                                }

                                                if(grade){
                                                    for(var i=0;i<grade.users.length;i++){
                                                        if(grade.users[i].toString()===user._id){
                                                            grade.users.splice(i,1);
                                                            break;
                                                        }
                                                    }
                                                    grade.save(function(err,grade){
                                                        if(err){
                                                            res.json({success:0,info:'数据库读取失败'});
                                                            return console.log(err);
                                                        }
                                                        console.log('grade'+grade);
                                                        res.json({success:1});
                                                    });
                                                }
                                                else{
                                                    res.json({success:0,info:'参数错误,请刷新页面重试4'});
                                                }

                                            })
                                        }
                                        else{
                                            //grade无效就说明，没有设置班级信息，不需要进行删除了
                                            res.json({success:1});
                                        }

                                    });
                                }

                            });
                        }
                        else{
                            res.json({success:0,info:'参数错误,请刷新页面重试1'});
                        }
                    })
                }
                else{
                    res.json({success:0,info:'参数错误,请刷新页面重试2'});
                }
            })
        }
        else{
            res.json({success:0,info:'参数错误,请刷新页面重试3'});
        }
    })
}