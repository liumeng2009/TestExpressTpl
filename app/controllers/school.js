/**
 * Created by Administrator on 2016/5/31.
 */
//var mongoose=require('mongoose');
var School=require('../models/school');
var User=require('../models/user');
var Role=require('../models/role');
var _=require('underscore');

exports.school=function(req,res){
    var id=req.params.id;
    User.find({status:true,isPresident:true}).exec(function(err,users){
        if(err){
            err.status=500;
            res.render('error',{
                message:err.name,
                error:err
            })
            return console.log(err);
        }
        else{
            School.findOne({_id:id},function(err,school){
                if(err){
                    err.status=500;
                    res.render('error',{
                        message:err.name,
                        error:err
                    })
                    return console.log(err);
                }
                console.log('学校信息'+school);
                if(school){
                    res.render('./pages/school/school_edit',{
                        title:'编辑学校信息',
                        school:school,
                        action:'编辑',
                        users:users
                    });
                }
                else{
                    res.render('./pages/school/school',{
                        title:'新增学校',
                        school:[],
                        action:'新增',
                        users:users
                    });
                }
            });
        }
    });
}

exports.school_list=function(req,res){
    var searchObj={};
    if(req.query.user&&req.query.user!=0){
        searchObj.owner=req.query.user;
    }
    if(req.query.name&&req.query.name!=""){
        searchObj.name=req.query.name;
    }
    searchObj.status=true;

    School.find(searchObj)
        .populate('owner')
        .exec(function(err,schools){
            if(err)
                return console.log(err);
            User.find({status:true,isPresident:true},function(err,users){
                if(err){
                    err.status=500;
                    res.render('error',{
                        message:err.name,
                        error:err
                    })
                    return console.log(err);
                }
                res.render('./pages/school/school_list',{
                    title:'学校列表',
                    schools:schools,
                    users:users
                });
            })
        });
}

exports.new=function(req,res,next){
    var id=req.body._id;
    User.findById({_id:req.body.user,status:true},function(err,user){
        if(err){
            err.status=500;
            res.render('error',{
                message:err.name,
                error:err
            })
            return console.log(err);
        }
        var schoolObj={
            name: req.body.name,
            owner:user,
            status:true,
            province:req.body.province,
            city:req.body.city,
            country:req.body.country,
            address:req.body.address,
            intro:req.body.intro,
            color:req.body.color,
            image:req.body.image,
            roles:[],
            grades:[]
        };
        //id存在就是编辑 不存在就是新增
        if(id){
            School.findOne({status:true,_id:id},function(err,school){
                if(err){
                    err.status=500;
                    res.render('error',{
                        message:err.name,
                        error:err
                    })
                    return console.log(err);
                }
                var _school= _.extend(school,schoolObj);
                _school.save(function(err,school){
                    if(err){
                        err.status=500;
                        res.render('error',{
                            message:err.name,
                            error:err
                        })
                        return console.log(err);
                    }
                    //school添加到user里面

                    if(user.schools){
                        if(user.schools.toString().indexOf(school._id)>-1){
                            return res.redirect('/admin/school/list');
                            //next();
                        }
                        else{
                            user.schools.push(school);
                            user.save(function(err,president){
                                if(err){
                                    err.status=500;
                                    res.render('error',{
                                        message:err.name,
                                        error:err
                                    })
                                    return console.log(err);
                                }
                                return res.redirect('/admin/school/list');
                                //next();
                            });
                        }
                    }
                    else{
                        user.schools=[];
                        user.schools.push(school);
                        user.save(function(err,user){
                            if(err){
                                err.status=500;
                                res.render('error',{
                                    message:err.name,
                                    error:err
                                })
                                return console.log(err);
                            }
                            return res.redirect('/admin/school/list');
                            //next();
                        });
                    }
                });
            });
        }
        else{
            School.find({name:schoolObj.name},function(err,school){
                if(err){
                    err.status=500;
                    res.render('error',{
                        message:err.name,
                        error:err
                    })
                    return console.log(err);
                }
                if(school&&school.length>0){
                    return res.redirect('/admin/school?err=exist');
                }else{
                    var _school=new School(schoolObj);
                    _school.save(function(err,school){
                        if(err){
                            err.status=500;
                            res.render('error',{
                                message:err.name,
                                error:err
                            })
                            return console.log(err);
                        }
                        //将school保存到president的schools字段
                        user.schools.push(school);
                        user.save(function(err,user){
                            if(err){
                                err.status=500;
                                res.render('error',{
                                    message:err.name,
                                    error:err
                                })
                                return console.log(err);
                            }
                            //res.redirect('/admin/school/list');
                            req.app.locals.schoolnew=school._id;
                            next();
                        });
                    });
                }
            });
        }
    });
}

exports.new_init=function(req,res){
    //新增学校结束后，给学校建立四个默认的角色 校长 班主任 老师 家长
    if(req.app.locals.schoolnew){
        var sid=req.app.locals.schoolnew;
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
        res.render('error',{
            status:500,
            message:'角色初始化失败',
            error:'角色初始化失败'
        })
    }

}

exports.delete=function(req,res){
    //学校的删除，只看有没有班级了，如果有，拒绝删除 如果没有，那么就直接置否。他里面的users不管。
    var id=req.query.id;
    if(id){
        School.findOne({status:true,_id:id})
            .populate('roles')
            .exec(function(err,school){
                if(err){
                    res.json({success:0,info:'数据库读取失败'});
                    return console.log(err);
                }
                if(school){
                    if(school.grades&&school.grades.length>0){
                        //说明还有班级，不能删
                        res.json({success:0,info:'学校内还有班级存在，请先删除班级，再尝试删除学校。'});
                    }
                    else {
                        School.update({_id: id}, {$set: {status: false}}, function (err, _school) {
                            if (err) {
                                res.json({success: 0, info: '数据库读取失败'});
                                return console.log(err);
                            }
                            //将roles里面的role全部置否
                            console.log('2222222222'+school);
                            var _roleObj=[];
                            for(var i=0;i<school.roles.length;i++){
                                var _r={_id:school.roles[i]._id};
                                _roleObj.push(_r);
                            }
                            Role.find({status:true})
                                .setOptions({multi:true})
                                .update({$or:_roleObj},{status:false},function(err,roles){
                                    res.json({success: 1});
                                });
                        });
                    }
                }
                else{
                    res.json({success:0,info:'没有此数据'});
                }
            })
    }
    else{
        res.json({success:0,info:'参数错误'});
    }
}

exports.select=function(req,res){
    School.find({status:true})
        .populate('owner')
        .exec(function(err,schools){
        if(err){
            err.status = 500;
            res.render('error', {
                message: err.name,
                error: err
            })
            return console.log(err);
        }
        res.render('./pages/school/school_select',{
            title:'选择学校',
            schools:schools,
            fronturl:req.query.redirecturl
        })
    });
}

exports.change=function(req,res){
    var sid=req.query.sid;
    School.findById({status:true,_id:sid},function(err,school){
        if(err){
            err.status = 500;
            res.render('error', {
                message: err.name,
                error: err
            })
            return console.log(err);
        }
        //session保存当前选到的学校信息
        if(school) {
            req.session.schoolnow = {
                name: school.name,
                id: school._id
            }
            res.redirect(req.query.redirecturl);
        }
        else{
            res.redirect('/admin');
        }
    })
}

//中间件
exports.validSchoolId=function(req,res,next){
    var sid=req.query.sid;
    if(sid) {
        console.log('没有到达这里吗');
        if (!sid.match(/^[0-9a-fA-F]{24}$/)) {
            var err = new Error('参数错误');
            err.status = 404;
            err.message='错误的参数格式';
            next(err);
        }
    }
    next();
}

exports.school_list_allpage=function(req,res,next){
    School.find({status:true})
        .exec(function(err,schools){
            if(err)
                return console.log(err);
            res.app.locals.schoolhead=schools;
            next();
        });
}

exports.school_checkid=function(req,res,next){
    if(req.session.schoolnow){
        next();
    }
    else{
        res.redirect('/admin/school_select?redirecturl='+req.originalUrl);
    }
}