/**
 * Created by Administrator on 2016/6/6.
 */
var Role=require('../models/role');
var School=require('../models/school');
var FunctionModel=require('../models/function');
var _=require('underscore');

exports.role_list=function(req,res){
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
            Role.find({school:schoolid,status:true})
                .populate('school')
                .exec(function(err,roles){
                    if (err){
                        err.status=500;
                        res.render('error',{
                            message:err.name,
                            error:err
                        })
                        return console.log(err);
                    }
                    res.render('./pages/role/role_list',{
                        title:school.name+" 角色列表",
                        roles:roles,
                        school:school,
                        sid:schoolid
                    });
                });
        }
        else{
            res.redirect('/admin/school_change');
        }
    });
}

exports.role=function(req,res){
    var sid=req.session.schoolnow.id;
    var id=req.query.id;
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
            if(id){
                Role.findById({status:true,_id:id},function(err,role){
                    if(err){
                        err.status=500;
                        res.render('error',{
                            message:err.name,
                            error:err
                        })
                        return console.log(err);
                    }
                    FunctionModel.find({status:true},function(err,func){
                        if(err){
                            err.status=500;
                            res.render('error',{
                                message:err.name,
                                error:err
                            })
                            return console.log(err);
                        }
                        res.render('./pages/role/role_edit',{
                            title:'编辑角色',
                            role:role,
                            sid:sid,
                            action:'编辑',
                            functions:func,
                            school:school
                        });
                    });
                });
            }
            else{
                FunctionModel.find({status:true},function(err,func) {
                    if(err){
                        err.status=500;
                        res.render('error',{
                            message:err.name,
                            error:err
                        })
                        return console.log(err);
                    }
                    res.render('./pages/role/role', {
                        title: '新增角色',
                        role: {},
                        school:school,
                        sid: sid,
                        action: '新增',
                        functions:func
                    });
                });
            }
        }
        else{
            res.redirect('/admin/school_change');
        }

    });
}
exports.new=function(req,res){
    var sid=req.session.schoolnow.id;
    var id=req.body.id;
    var obj=req.body;
    var funs=[];
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
            FunctionModel.find({status:true},function(err,functions){
                if(err){
                    err.status=500;
                    res.render('error',{
                        message:err.name,
                        error:err
                    })
                    return console.log(err);
                }
                for(var r=0;r<functions.length;r++){
                    var funPer={};
                    funPer.name=functions[r].name;
                    funPer.index=functions[r].index;
                    funPer.actions={};
                    for(var prop in obj){
                        if(typeof(obj[prop])=="function"){

                        }
                        else{
                            if(prop.indexOf(functions[r].index)>-1){
                                if(prop.indexOf('Create')>-1){
                                    funPer.actions.create=true;
                                }
                                if(prop.indexOf('Delete')>-1){
                                    funPer.actions.delete=true;
                                }
                                if(prop.indexOf('Show')>-1){
                                    funPer.actions.show=true;
                                }
                                if(prop.indexOf('Edit')>-1){
                                    funPer.actions.edit=true;
                                }
                                if(prop.indexOf('Confirm')>-1){
                                    funPer.actions.confirm=true;
                                }
                            }
                        }
                    }
                    funs.push(funPer);
                }

                var roleObj={
                    name:req.body.name,
                    school:school._id,
                    weight:req.body.weight,
                    functions:funs,
                    status:true
                };
                if(id){
                    Role.findById({_id:id,status:true},function(err,role){
                        if(err){
                            err.status=500;
                            res.render('error',{
                                message:err.name,
                                error:err
                            })
                            return console.log(err);
                        }
                        var _roleObj= _.extend(role,roleObj);
                        _roleObj.save(function(err,role){
                            if (err){
                                err.status=500;
                                res.render('error',{
                                    message:err.name,
                                    error:err
                                })
                                return console.log(err);
                            }
                            res.redirect('/admin/role/list?sid=' + sid);
                        });
                    });
                }
                else {
                    var _role = new Role(roleObj);
                    _role.save(function (err, role) {
                        if (err){
                            err.status=500;
                            res.render('error',{
                                message:err.name,
                                error:err
                            })
                            return console.log(err);
                        }
                        school.roles.push(role._id);
                        school.save(function (err, school) {
                            if (err){
                                err.status=500;
                                res.render('error',{
                                    message:err.name,
                                    error:err
                                })
                                return console.log(err);
                            }
                            res.redirect('/admin/role/list?sid=' + sid);
                        })

                    });
                }
            });
        }
        else{
            res.redirect('/admin/school_change');
        }
    });
}

//根据学校id寻找他的角色
exports.findRoleBySchool=function(req,res){
    var sid=req.params.sid;
    School.find({status:true,_id:sid},function(err,school){
        if(err)
            return console.log(err);
        if(school){
            Role.find({school:school[0]._id},function(err,roles){
                if(err)
                    return console.log(err)
                res.send(roles);
            })
        }
        else{
            res.send('[]');
        }
    });
}

exports.delete=function(req,res){
    var id=req.query.id;
    if(id){
        Role.findById({status:true,_id:id},function(err,role){
            if(err){
                res.json({success:0,info:'数据库读取失败'});
                return console.log(err);
            }
            if(role){
                Role.update({_id:id},{$set:{status:false}},function(err){
                    if(err){
                        res.json({success:0,info:'数据库读取失败'});
                        return console.log(err);
                    }
                    //删除role在school里面的记录
                    School.findById({_id:role.school.toString()},function(err,school){
                        if(err){
                            res.json({success:0,info:'数据库读取失败'});
                            return console.log(err);
                        }
                        if(school.roles){
                            for(var i=0;i<school.roles.length;i++){
                                if(school.roles[i].toString()===role._id.toString()){
                                    school.roles.splice(i,1);
                                }
                            }
                            school.save(function(err){
                                if(err){
                                    res.json({success:0,info:'数据库读取失败'});
                                    return console.log(err);
                                }
                                res.json({success:1});
                            })
                        }
                        else{
                            res.json({success:1});
                        }
                    })


                });
            }
            else{
                res.json({success:0,info:'没有此数据'});
            }
        });
    }
    else{
        res.json({success:0,info:'参数错误'});
    }
}