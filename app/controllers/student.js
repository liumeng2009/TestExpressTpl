/**
 * Created by Administrator on 2016/6/15.
 */
var School=require('../models/school');
var Student=require('../models/student');
var Grade=require('../models/grade');
var User=require('../models/user');
var _=require('underscore');

exports.student_list=function(req,res){
    var sid=req.query.sid;
    School.findOne({status:true,_id:sid},function(err,school){
        if(err)
            return console.log(err);
        if(school){
            console.log('school是'+school);
            Student.find({status:true,school:school._id})
                .populate('school')
                .populate('parent')
                .populate('grade')
                .exec(function(err,students){
                    if(err)
                        return console.log(err);
                    res.render('./pages/student/student_list',{
                        title:school.name+'的学生列表',
                        sid:school._id,
                        students:students,
                        school:school
                    });
                });
        }
        else{
            School.find({status:true})
                .populate('header')
                .exec(function(err,schools) {
                    if (err)
                        return console.log(err);
                    res.render('./pages/student/student_list', {
                        title: '请先选择学校',
                        schools: schools
                    });
                });
        }
    });
}

exports.student=function(req,res){
    var sid=req.query.sid;
    var id=req.params.id;
    School.findOne({status:true,_id:sid},function(err,school){
        if(err)
            return console.log(err);
        if(school){
            Grade.find({status:true,school:school._id},function(err,grades){
                if(err)
                    return console.log(err);
                User.find({status:true,isParent:true},function(err,users){
                    if(err)
                        return console.log(err);
                    if(id){

                    }
                    else{
                        res.render('./pages/student/student',{
                            title:'新增学生信息',
                            action:'新增',
                            school:school,
                            grades:grades,
                            parents:users,
                            sid:school._id,
                            student:{}
                        });

                    }
                })
            });
        }
        else{
            res.redirect('/admin/student/list?err=snotexist');
        }
    });
}
exports.new=function(req,res){
    var id=req.body.id;
    var sid=req.body.sid;
    var gid=req.body.grade;
    var pid=req.body.parent;
    School.findById({status:true,_id:sid},function(err,school){
        if(err)
            return console.log(err);
        if(school){
            Grade.findOne({status:true,_id:gid},function(err,grade){
                if(err)
                    return console.log(err);
                User.findOne({status:true,_id:pid},function(err,parent){
                    if(err)
                        return console.log(err);
                        var studentObj={
                            name:req.body.name,
                            school:school,
                            grade:grade,
                            parent:parent,
                            sex:req.body.sex,
                            age:req.body.age,
                            health:req.body.health,
                            interest:req.body.interest,
                            state_now:req.body.state_now
                        };
                        if(id){
                            Student.findById({status:true,_id:id},function(err,student){
                                if(err)
                                    return console.log(err)
                                if(student){

                                }
                                else{
                                    res.redirect('/admin/student/list?sid='+school._id);
                                }
                            })
                        }
                        else{
                            var _student=new Student(studentObj);
                            _student.save(function(err,student){
                                if(err)
                                    return console.log(err);
                                res.redirect('/admin/student/list?sid='+school._id);
                            });
                        }
                });
            });
        }
        else{
            res.redirect('/admin/student/list?err=snotexist');
        }
    });

}