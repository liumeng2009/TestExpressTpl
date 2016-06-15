/**
 * Created by Administrator on 2016/6/6.
 */
var School=require('../models/school');
var User=require('../models/user');
var Grade=require('../models/grade');
var _=require('underscore');

exports.grade_list=function(req,res){
    var schoolid=req.query.sid;
    console.log('学校id是：'+schoolid);
    School.findOne({status:true,_id:schoolid},function(err,school){
        if(err)
            return console.log(err);

        console.log('得到的学校对象是：'+school);

        if(school){
            //学校存在
            Grade.find({status:true,school:schoolid})
                .populate('header')
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
            School.find({status:true})
                .populate('header')
                .exec(function(err,schools) {
                    if (err)
                        return console.log(err);
                    res.render('./pages/grade/grade_list', {
                        title: '请先选择学校',
                        schools: schools
                    });
                });
        }
    });
}

exports.grade=function(req,res){
    var sid=req.query.sid;
    var id=req.query.id;

    School.findOne({status:true,_id:sid},function(err,school){
        if(err)
            return console.log(err);
        if(school){
            //两个下拉框
            User.find({status:true,school:school._id},function(err,users){
                if(id){
                    //编辑模式
                    Grade.find({status:true,_id:id})
                        .populate('users')
                        .exec(function(err,grade){
                            if(err)
                                return console.log(err);
                            console.log('班级是：'+grade);
                            res.render('./pages/grade/grade_edit',{
                                title:'编辑班级信息',
                                grade:grade[0],
                                users:users,
                                sid:school._id,
                                action:'编辑',
                                school:school
                            });
                        });
                }
                else{
                    res.render('./pages/grade/grade',{
                        title:'新建班级信息',
                        grade:{},
                        users:users,
                        sid:school._id,
                        action:'新建',
                        school:school
                    });
                }
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
        if(err)
            console.log(err);
        if(school){
            //如果学校存在
            User.findById({status:true,_id:req.body.header},function(err,user){
                //找所有的班级成员
                var usersElement=req.body.users;
                var userArray=usersElement.split(',');
                var searchObj=[];
                for(var i=0;i<userArray.length;i++){
                    if(userArray[i].toString().trim()!="") {
                        var s = {_id: userArray[i]}
                        searchObj.push(s);
                    }
                }
                User.find({status:true})
                    .or(searchObj)
                    .exec(function(err,users){
                        var gradeObj={
                            status:true,
                            position:req.body.position,
                            school:school,
                            header:user,
                            users:users,
                            name:req.body.name
                        }
                        if(id){
                            Grade.findById({status:true,_id:id},function(err,grade){
                                if(err)
                                    return console.log(err);
                                var _grade= _.extend(grade,gradeObj);
                                console.log('保存之前：'+_grade);
                                _grade.save(function(err,grade){
                                    if(err)
                                        return console.log(err);
                                    res.redirect('/admin/grade/list?sid='+school._id);
                                });
                            });
                        }
                        else{
                            var _grade=new Grade(gradeObj);
                            _grade.save(function(err,grade){
                                if(err)
                                    return console.log(err);
                                res.redirect('/admin/grade/list?sid='+school._id);
                            });
                        }
                    });
            });
        }
        else{
            res.redirect('/admin/role/list?err=snotexist');
        }
    });
}