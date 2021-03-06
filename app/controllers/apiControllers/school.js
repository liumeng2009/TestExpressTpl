/**
 * Created by liumeng on 2016/7/11.
 */
var School=require('../../models/school');
var User=require('../../models/user')
var config=require('../../../config');
var Role=require('../../models/role');
var _=require('underscore');

//用户名下的学校
exports.school_list=function(req,res){
    var user=req.app.locals.user;
    if(user){
        School.find({status:true,owner:user._id.toString()})
            .populate('owner')
            .exec(function(err,schools){
                if(err){
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.json({success:0,msg:config.msg.db});
                    return console.log(err);
                }
                else{
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.json({success:1,msg:config.msg.success,schools:schools})
                }
            });
    }
    else{
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({success:0,msg:config.msg.notexists});
    }
}

exports.school=function(req,res){
    var id=req.query.id;
    School.findOne({status:true,_id:id},function(err,school){
        if(err){
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json({success:0,msg:config.msg.db});
            return console.log(err);
        }
        res.setHeader('Access-Control-Allow-Origin', '*');
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
        intro:req.body.intro,
        status:true
    }
    if(id){
        //编辑
        School.findOne({status:true,_id:id},function(err,school){
            if(err){
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.json({success:0,msg:config.msg.db});
                return console.log(err);
            }
            if(school){
                var _school= _.extend(school,schoolObj);
                console.log(_school);
                _school.save(function(err,school){
                    if(err){
                        res.setHeader('Access-Control-Allow-Origin', '*');
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
                                res.setHeader('Access-Control-Allow-Origin', '*');
                                res.json({success:0,msg:config.msg.db});
                                return console.log(err);
                            }
                            res.app.locals.schoolapinew=undefined;
                            res.setHeader('Access-Control-Allow-Origin', '*');
                            res.json({success:1,msg:config.msg.success});
                        });
                    }
                })
            }
            else{
                res.setHeader('Access-Control-Allow-Origin', '*');
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
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.json({success:0,msg:config.msg.db});
                return console.log(err);
            }
            user.schools.push(school);
            user.save(function(err,user){
                if(err){
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.json({success:0,msg:config.msg.db});
                    return console.log(err);
                }
                res.app.locals.schoolapinew=school._id;
                //res.json({success:1,msg:config.msg.success});
                next();
            });
        })
    }

}

exports.initRole=function(req,res,next){
    //新增学校结束后，给学校建立四个默认的角色 校长 班主任 老师 家长
    console.log('新增学校结束后，给学校建立四个默认的角色 校长 班主任 老师 家长'+req.app.locals.schoolapinew);
    var user=req.app.locals.user;
    if(req.app.locals.schoolapinew){
        var sid=req.app.locals.schoolapinew;
        School.findOne({status:true,_id:sid},function(err,school){
            console.log('22222222222222'+school);
            if(school){
                //建立四个角色
                //校长
                console.log('3333333333'+school);
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
                                                console.log('fffffffffffffffffinished');
                                                //将role组合，加入到user的roles中
                                                //parent需要增加role
                                                var roleObj={

                                                }
                                                for(var i=0;i<school.roles.length;i++){
                                                    if(school.roles[i].name==='校长'){
                                                        roleObj.role=mongoose.Types.ObjectId(school.roles[i]._id);
                                                        roleObj.grade='0';
                                                    }
                                                }
                                                user.roles.push(roleObj);
                                                user.save(function(err,user){
                                                    next();
                                                })

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
                next();
            }
        });
    }
    else{
        next();
    }
}
exports.initUser=function(req,res){
    //在上一个中间件中已经完成了
}

exports.school_list_all=function(req,res){
    School.find({status:true})
        .exec(function(err,schools){
        if(err){
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json({success:0,msg:config.msg.db});
            return console.log(err);
        }
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({success:1,msg:config.msg.success,schools:schools});
    });
}