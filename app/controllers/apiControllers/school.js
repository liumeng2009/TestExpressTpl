/**
 * Created by liumeng on 2016/7/11.
 */
var School=require('../../models/school');
var User=require('../../models/user')
var config=require('../../../config');
var _=require('underscore');

exports.school_list=function(req,res){
    var user=req.app.locals.user;
    if(user){
        School.find({status:true,owner:user._id.toString()})
            .populate('owner')
            .exec(function(err,schools){
                if(err){
                    res.json({success:0,msg:config.msg.db});
                    return console.log(err);
                }
                else{
                    res.json({success:1,msg:config.msg.success,schools:schools})
                }
            });
    }
    else{
        res.json({success:0,msg:config.msg.notexists});
    }
}

exports.school=function(req,res){
    var id=req.query.id;
    School.findOne({status:true,_id:id},function(err,school){
        if(err){
            res.json({success:0,msg:config.msg.db});
            return console.log(err);
        }
        res.json({success:1,msg:config.msg.success,school:school});
    })
}

exports.new=function(req,res,next){
    var user=req.app.locals.user;
    var name=req.body.name;
    var id=req.body._id;
    var schoolObj={
        name:req.body.name,
        owner:user,
        province:req.body.province,
        city:req.body.city,
        country:req.body.country,
        address:req.body.address,
        intro:req.body.intro
    }
    if(id){
        //编辑
        School.findOne({status:true,_id:id},function(err,school){
            if(err){
                res.json({success:0,msg:config.msg.db});
                return console.log(err);
            }
            if(school){
                var _school= _.extend(school,schoolObj);
                console.log(_school);
                _school.save(function(err,school){
                    if(err){
                        res.json({success:0,msg:config.msg.db});
                        return console.log(err);
                    }
                    //检查user中是否有这个school
                    if(user.schools.toString().indexOf(school._id.toString())>-1){
                        res.app.locals.schoolapinew=undefined;
                        res.json({success:1,msg:config.msg.success});
                    }
                    else{
                        user.schools.push(school);
                        user.save(function(err,user){
                            if(err){
                                res.json({success:0,msg:config.msg.db});
                                return console.log(err);
                            }
                            res.app.locals.schoolapinew=undefined;
                            res.json({success:1,msg:config.msg.success});
                        });
                    }
                })
            }
            else{
                res.json({success:0,msg:config.msg.notexists});
                return console.log(err);
            }
        })
    }
    else{
        //新增
        var _school=new School(schoolObj);
        _school.save(function(err,school){
            if(err){
                res.json({success:0,msg:config.msg.db});
                return console.log(err);
            }
            user.schools.push(school);
            user.save(function(err,user){
                if(err){
                    res.json({success:0,msg:config.msg.db});
                    return console.log(err);
                }
                res.app.locals.schoolapinew=school._id;
                res.json({success:1,msg:config.msg.success});
            });
        })
    }

}

exports.initRole=function(req,res,next){
    //新增学校结束后，给学校建立四个默认的角色 校长 班主任 老师 家长
    if(req.app.locals.schoolapinew){
        var sid=req.app.locals.schoolapinew;
        School.findOne({status:true,_id:sid},function(err,school){
            if(school){
                //建立四个角色
                //校长
                var rolePresident={
                    name:'校长',
                    school:school,
                    weight:999,
                    status:true,
                    functions:[
                        {
                            name:'学校管理',
                            index:'school_manage',
                            actions: {
                                create: true,
                                delete:true,
                                show:true,
                                edit:true,
                                confirm:true
                            }
                        },
                        {
                            name:'班级管理',
                            index:'grade_manage',
                            actions: {
                                create: true,
                                delete:true,
                                show:true,
                                edit:true,
                                confirm:true
                            }
                        },
                        {
                            name:'学生管理',
                            index:'student_manage',
                            actions: {
                                create: true,
                                delete:true,
                                show:true,
                                edit:true,
                                confirm:true
                            }
                        },
                        {
                            name:'公告管理',
                            index:'notice_manage',
                            actions: {
                                create: true,
                                delete:true,
                                show:true,
                                edit:true
                            }
                        },
                        {
                            name:'通知管理',
                            index:'notify_manage',
                            actions: {
                                create: true,
                                delete:true,
                                show:true,
                                edit:true
                            }
                        },
                        {
                            name:'小纸条',
                            index:'shortmessage_manage',
                            actions: {
                                create: true,
                                delete:true,
                                show:true,
                                edit:true
                            }
                        }
                    ]
                };
                //班主任
                var roleLeader={
                    name:'班主任',
                    school:school,
                    weight:999,
                    status:true,
                    functions:[
                        {
                            name:'学校管理',
                            index:'school_manage',
                            actions: {
                                create: false,
                                delete:false,
                                show:false,
                                edit:false,
                                confirm:false
                            }
                        },
                        {
                            name:'班级管理',
                            index:'grade_manage',
                            actions: {
                                create: false,
                                delete:false,
                                show:true,
                                edit:false,
                                confirm:false
                            }
                        },
                        {
                            name:'学生管理',
                            index:'student_manage',
                            actions: {
                                create: true,
                                delete:true,
                                show:true,
                                edit:true,
                                confirm:true
                            }
                        },
                        {
                            name:'公告管理',
                            index:'notice_manage',
                            actions: {
                                create: false,
                                delete:false,
                                show:false,
                                edit:false
                            }
                        },
                        {
                            name:'通知管理',
                            index:'notify_manage',
                            actions: {
                                create: true,
                                delete:true,
                                show:true,
                                edit:true
                            }
                        },
                        {
                            name:'小纸条',
                            index:'shortmessage_manage',
                            actions: {
                                create: true,
                                delete:true,
                                show:true,
                                edit:true
                            }
                        }
                    ]
                };
                //老师
                var roleTeacher={
                    name:'老师',
                    school:school,
                    weight:999,
                    status:true,
                    functions:[
                        {
                            name:'学校管理',
                            index:'school_manage',
                            actions: {
                                create: false,
                                delete:false,
                                show:false,
                                edit:false,
                                confirm:false
                            }
                        },
                        {
                            name:'班级管理',
                            index:'grade_manage',
                            actions: {
                                create: false,
                                delete:false,
                                show:true,
                                edit:false,
                                confirm:false
                            }
                        },
                        {
                            name:'学生管理',
                            index:'student_manage',
                            actions: {
                                create: true,
                                delete:true,
                                show:true,
                                edit:true,
                                confirm:true
                            }
                        },
                        {
                            name:'公告管理',
                            index:'notice_manage',
                            actions: {
                                create: false,
                                delete:false,
                                show:false,
                                edit:false
                            }
                        },
                        {
                            name:'通知管理',
                            index:'notify_manage',
                            actions: {
                                create: false,
                                delete:false,
                                show:false,
                                edit:false
                            }
                        },
                        {
                            name:'小纸条',
                            index:'shortmessage_manage',
                            actions: {
                                create: true,
                                delete:true,
                                show:true,
                                edit:true
                            }
                        }
                    ]
                };
                //家长
                var roleParent={
                    name:'家长',
                    school:school,
                    weight:999,
                    status:true,
                    functions:[
                        {
                            name:'学校管理',
                            index:'school_manage',
                            actions: {
                                create: false,
                                delete:false,
                                show:false,
                                edit:false,
                                confirm:false
                            }
                        },
                        {
                            name:'班级管理',
                            index:'grade_manage',
                            actions: {
                                create: false,
                                delete:false,
                                show:false,
                                edit:false,
                                confirm:false
                            }
                        },
                        {
                            name:'学生管理',
                            index:'student_manage',
                            actions: {
                                create: false,
                                delete:false,
                                show:true,
                                edit:false,
                                confirm:false
                            }
                        },
                        {
                            name:'公告管理',
                            index:'notice_manage',
                            actions: {
                                create: false,
                                delete:false,
                                show:false,
                                edit:false
                            }
                        },
                        {
                            name:'通知管理',
                            index:'notify_manage',
                            actions: {
                                create: false,
                                delete:false,
                                show:false,
                                edit:false
                            }
                        },
                        {
                            name:'小纸条',
                            index:'shortmessage_manage',
                            actions: {
                                create: true,
                                delete:true,
                                show:true,
                                edit:true
                            }
                        }
                    ]
                };

                var rolePresident=new Role(rolePresident);
                var roleLeader=new Role(roleLeader);
                var roleTeacher=new Role(roleTeacher);
                var roleParent=new Role(roleParent);
                rolePresident.save(function(err,president){
                    school.roles.push(president);
                    school.save(function(err,school){
                        roleLeader.save(function(err,leader){
                            school.roles.push(leader);
                            school.save(function(err,school){
                                roleTeacher.save(function(err,teacher){
                                    school.roles.push(teacher);
                                    school.save(function(err,school){
                                        roleParent.save(function(err,parent){
                                            school.roles.push(parent);
                                            school.save(function(err,school){
                                                res.redirect('/admin/school/list');
                                            })
                                        })
                                    });
                                });
                            });
                        });
                    });
                });


            }
            else{
                res.render('error',{
                    status:500,
                    message:'角色初始化失败',
                    error:'角色初始化失败'
                })
            }
        });
    }
    else{
        next();
    }
}
exports.initUser=function(req,res){
    console.log('将学校的建立者，赋值一个身份上去，让他拥有这个学校的"校长"身份');
}