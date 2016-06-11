/**
 * Created by Administrator on 2016/6/6.
 */
var Role=require('../models/role');
var School=require('../models/school');
var FunctionModel=require('../models/function');
var _=require('underscore');

exports.role_list=function(req,res){
    var schoolid=req.query.sid;
    School.findOne({status:true,_id:schoolid},function(err,school){
        if(err)
            return console.log(err);
        if(school){
            //学校存在
            Role.find({school:schoolid})
                .populate('school')
                .exec(function(err,roles){
                    if (err)
                        return console.log(err);
                    res.render('./pages/role/role_list',{
                        title:school.name+" 角色列表",
                        roles:roles,
                        school:school,
                        sid:schoolid
                    });
                });
        }
        else{
            School.find({status:true})
                .populate('owner')
                .exec(function(err,schools) {
                    if (err)
                        return console.log(err);
                    res.render('./pages/role/role_list', {
                        title: '请先选择学校',
                        schools: schools
                    });
                });
        }
    });
}

exports.role=function(req,res){
    var sid=req.query.sid;
    var id=req.query.id;
    School.findById({status:true,_id:sid},function(err,school){
        if(err)
            return console.log(err);
        if(school){
            //学校存在进入正常逻辑
            if(id){
                //编辑模式
                Role.findById({status:true,_id:id},function(err,role){
                    if(err)
                        return console.log(err);
                    FunctionModel.find({status:true},function(err,func){
                        if(err)
                            return console.log(err);
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
                    if(err)
                        return console.log(err);
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
            res.redirect('/admin/role/list?err=snotexist');
        }

    });
}
exports.new=function(req,res){
    var sid=req.body.sid;
    var id=req.body.id;

    console.log("sid="+sid);
    console.log('id='+id);

    var obj=req.body;

    var funs=[];
    School.findById({status:true,_id:sid},function(err,school){
        if(err)
            return console.log(err)
        if(school){
            FunctionModel.find({status:true},function(err,functions){
                if(err)
                    return console.log(err);
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
                    functions:funs
                };
                if(id){
                    Role.findById({_id:id,status:true},function(err,role){
                        if(err)
                            console.log(err);
                        console.log('到这里了吗1111111111111111111？');
                        var _roleObj= _.extend(role,roleObj);
                        _roleObj.save(function(err,role){
                            if (err)
                                return console.log(err);
                            res.redirect('/admin/role/list?sid=' + sid);
                        });
                    });
                }
                else {
                    console.log('到这里了吗222222222222222222222222？');
                    var _role = new Role(roleObj);
                    _role.save(function (err, role) {
                        if (err)
                            return console.log(err);
                        school.roles.push(role._id);
                        school.save(function (err, school) {
                            if (err)
                                return console.log(err);
                            res.redirect('/admin/role/list?sid=' + sid);
                        })

                    });
                }
            });
        }
        else{
            res.redirect('/admin/role/list?err=snotexist');
        }
    });
}

var checkToActions=function(obj){
    var funs=[];

}