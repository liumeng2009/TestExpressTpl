/**
 * Created by Administrator on 2016/6/6.
 */
var School=require('../models/school');
var User=require('../models/user');
var Grade=require('../models/grade');
var Role=require('../models/role');
var _=require('underscore');

exports.grade_list=function(req,res){
    var schoolid=req.session.schoolnow.id;
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
            //学校存在
            Grade.find({status:true,school:schoolid})
                .populate('users')
                .exec(function(err,grades){
                    if(err)
                        return console.log(err);
                    console.log('班级列表是:'+grades);
                    res.render('./pages/grade/grade_list',{
                        title:school.name+" 班级列表",
                        grades:grades,
                        school:school
                    })
                });
        }
        else{
            res.redirect('/admin/school_select');
        }
    });
}

exports.grade=function(req,res){
    var sid=req.query.sid;
    var id=req.params.id;
    School.findOne({status:true,_id:sid},function(err,school){
        if(err)
            return console.log(err);
        if(school){
            User.find({status:true,isWorker:true})
                //有一项信息不完整，就给他重新设定学校 班级 角色信息
                .or([{school:undefined},{grade:undefined},{role:undefined}])
                .exec(function(err,users){
                    if(err){
                        err.status=500;
                        res.render('error',{
                            message:err.name,
                            error:err
                        })
                        return console.log(err);
                    }
                    Role.find({status:true,school:school._id},function(err,roles){
                        if(err){
                            err.status=500;
                            res.render('error',{
                                message:err.name,
                                error:err
                            })
                            return console.log(err);
                        }
                        if(id){
                            Grade.findOne({status:true,_id:id})
                                .populate({
                                    path:'users',
                                    model:'user',
                                    populate:{
                                        path:'role',
                                        model:'role'
                                    }
                                })
                                .exec(function(err,grade) {
                                    if (err) {
                                        err.status = 500;
                                        res.render('error', {
                                            message: err.name,
                                            error: err
                                        })
                                        return console.log(err);
                                    }
                                    if (grade) {
                                        res.render('./pages/grade/grade_edit', {
                                            title: '编辑班级信息',
                                            grade: grade,
                                            users: users,
                                            sid: school._id,
                                            action: '编辑',
                                            school: school,
                                            roles: roles
                                        });
                                    }
                                    else {
                                        res.redirect('/admin/grade/list?sid=' + sid);
                                    }
                                });
                        }
                        else{
                            res.render('./pages/grade/grade',{
                                title:'新建班级信息',
                                grade:{},
                                users:users,
                                sid:school._id,
                                action:'新建',
                                school:school,
                                roles:roles
                            });
                        }
                    });
                });
        }
        else{
            res.redirect('/admin/grade/list?err=snotexist');
        }
    });
}

exports.new=function(req,res){
    var id=req.body.id;
    var sid=req.body.sid;

    School.findById({status:true,_id:sid},function(err,school){
        if(err){
            err.status=500;
            res.render('error',{
                message:err.name,
                error:err
            })
            return console.log(err);
        }
        if(school){
            //如果学校存在
            var gradeObj={
                status:true,
                position:req.body.position,
                school:school,
                name:req.body.name
            }
            if(id){
                Grade.findById({status:true,_id:id},function(err,grade){
                    if(err){
                        err.status=500;
                        res.render('error',{
                            message:err.name,
                            error:err
                        })
                        return console.log(err);
                    }
                    var _grade= _.extend(grade,gradeObj);
                    _grade.save(function(err,grade){
                        if(err){
                            err.status=500;
                            res.render('error',{
                                message:err.name,
                                error:err
                            })
                            return console.log(err);
                        }
                        res.redirect('/admin/grade/list?sid='+school._id);
                    });
                });
            }
            else{
                var _grade=new Grade(gradeObj);
                _grade.save(function(err,grade){
                    if(err){
                        err.status=500;
                        res.render('error',{
                            message:err.name,
                            error:err
                        })
                        return console.log(err);
                    }
                    res.redirect('/admin/grade/list?sid='+school._id);
                });
            }
        }
        else{
            res.redirect('/admin/role/list?err=snotexist');
        }
    });
}

exports.insertuser=function(req,res){
    //对user赋值
    //user表里面的school，grade，role都要赋值
    //grade表里面的users添加users
    var sid=req.body.sid;
    var id=req.body.grade_id;

    console.log('id是'+id);

    School.findOne({status:true,_id:sid},function(err,school){
        if(err){
           err.status=500;
           res.render('error',{
               message:err.name,
               error:err
           })
           return console.log(err);
        }
        console.log('school是：'+school);
        if(school){
            Grade.findOne({status:true,_id:id},function(err,grade){
                if(err){
                    err.status=500;
                    res.render('error',{
                        message:err.name,
                        error:err
                    })
                    return console.log(err);
                }
                console.log('grade是：'+grade);
                if(grade){
                    console.log('99999999999999999999'+req.body.role);
                    Role.findOne({status:true,_id:req.body.role},function(err,role){
                       if(err){
                           err.status=500;
                           res.render('error',{
                               message:err.name,
                               error:err
                           })
                           return console.log(err);
                       }
                        console.log('role是：'+role);
                        if(role){
                            User.findOne({status:true,_id:req.body.user},function(err,user){
                                console.log('找到的user对象是：'+grade);
                                if(err){
                                    err.status=500;
                                    res.render('error',{
                                        message:err.name,
                                        error:err
                                    })
                                    return console.log(err);
                                }
                                console.log('user是：'+user);
                                if(user){
                                    //user插入school grade role数据
                                    var userObj={
                                        school:school,
                                        grade:grade,
                                        role:role
                                    };
                                    var _user= _.extend(user,userObj);
                                    console.log('保存前的用户对象：'+_user);
                                    _user.save(function(err,user){
                                        if(err){
                                            err.status=500;
                                            res.render('error',{
                                                message:err.name,
                                                error:err
                                            })
                                            return console.log(err);
                                        }
                                        grade.users.push(user);
                                        console.log('保存班级前的对象：'+grade);
                                        grade.save(function(err,grade){
                                            if(err){
                                                err.status=500;
                                                res.render('error',{
                                                    message:err.name,
                                                    error:err
                                                })
                                                return console.log(err);
                                            }
                                            res.redirect('/admin/grade/list?sid='+sid);
                                        });
                                    });
                                    //grade插入user数据
                                }
                                else{
                                    res.redirect('/admin/grade/'+id+'?sid='+school._id+'&err=wrongparams');
                                }
                            });
                        }
                        else{
                            res.redirect('/admin/grade/'+id+'?sid='+school._id+'&err=wrongparams');
                        }
                    });
                }
                else{
                    res.redirect('/admin/grade/'+id+'?sid='+school._id+'&err=wrongparams');
                }
            });
        }
        else{
            res.redirect('/admin/grade/list?err=snotexist');
        }

    });

}