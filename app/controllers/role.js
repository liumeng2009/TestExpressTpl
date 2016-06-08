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
                        //根据 role里面functions的值，给func赋值 如果func false，结果false 如果func true并且 role也true 结果true
                        for(var m=0;m<func.length;m++){
                            for(var n=0;n<role.functions.length;n++){
                                if(func[m].index===role.functions[n].index){
                                    for(var prop in func[m].actions){

                                    }
                                }
                            }
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

                var _role=new Role(roleObj);

                console.log('存储前对象：'+_role);

                _role.save(function(err,role){
                    if(err)
                        return console.log(err);
                    //将role添加进school的roles数组
                    //var _school=new School();
                    //var schoolSave= _.extend(_school,school);
                    //schoolSave.roles.push(role._id);

                    ///!!!!坚决不能new啊，new了id就变了，save就insert了，而不是update
                    var schoolObj={
                        roles:[

                        ]
                    }
                    schoolObj.roles.push(role._id);
                    var _school= _.extend(school,schoolObj);
                    _school.save(function(err,school){
                        if(err)
                            return console.log(err);
                        res.redirect('/admin/role/list?sid='+sid);
                    })

                });

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