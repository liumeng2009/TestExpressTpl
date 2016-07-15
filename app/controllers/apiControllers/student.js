/**
 * Created by Administrator on 2016/7/15.
 */
var Student=require('../../models/student');
var Grade=require('../../models/grade');
var School=require('../../models/school');
var User=require('../../models/user')
var config=require('../../../config');
var _=require('underscore');

exports.new=function(req,res){
    var user=req.app.locals.user;
    var id=req.body.id;
    var sid=req.body.school;
    var gid=req.body.grade;
    var pid=user._id;
    School.findById({status:true,_id:sid},function(err,school){
        if(err){
            res.json({success:0,msg:config.msg.db});
            return console.log(err);
        }
        if(school){
            Grade.findOne({status:true,_id:gid},function(err,grade){
                if(err){
                    res.json({success:0,msg:config.msg.db});
                    return console.log(err);
                }
                User.findOne({status:true,_id:pid},function(err,parent){
                    if(err){
                        res.json({success:0,msg:config.msg.db});
                        return console.log(err);
                    }
                    var studentObj={
                        name:req.body.name,
                        school:school,
                        grade:grade,
                        parent:parent,
                        sex:req.body.sex,
                        age:req.body.age,
                        health:req.body.health,
                        interest:req.body.interest,
                        state_now:req.body.state_now,
                        school_remark:req.body.school_remark,
                        status:true,
                        image:req.body.image
                    };
                    if(id){
                        Student.findById({status:true,_id:id},function(err,student){
                            if(err) {
                                res.json({success:0,msg:config.msg.db});
                                return console.log(err);
                            }
                            if(student){
                                var _student= _.extend(student,studentObj);
                                _student.save(function(err,student){
                                    if(err){
                                        res.json({success:0,msg:config.msg.db});
                                        return console.log(err);
                                    }
                                    //将student存入parent表
                                    if(parent.sons) {
                                    }
                                    else{
                                        parent.sons=[];
                                    }
                                    //是否存在
                                    if(parent.sons.toString().indexOf(student._id.toString())>-1){

                                    }
                                    else {
                                        parent.sons.push(student);
                                    }
                                    parent.save(function(err,parent){
                                        if(err){
                                            res.json({success:0,msg:config.msg.db});
                                            return console.log(err);
                                        }
                                        //将student存入grade表
                                        if(grade.students){
                                        }
                                        else{
                                            grade.students=[];
                                        }
                                        if(grade.students.toString().indexOf(student._id.toString())>-1){

                                        }
                                        else{
                                            grade.students.push(student);
                                        }

                                        grade.save(function(err,parent){
                                            if(err){
                                                res.json({success:0,msg:config.msg.db});
                                                return console.log(err);
                                            }
                                            res.json({success:1,msg:config.msg.success})
                                        });
                                    });
                                });
                            }
                            else{
                                res.json({success:0,msg:config.msg.notexists})
                            }
                        })
                    }
                    else{
                        var _student=new Student(studentObj);
                        _student.save(function(err,student){
                            if(err){
                                res.json({success:0,msg:config.msg.db});
                                return console.log(err);
                            }
                            //将student存入parent表
                            if(parent.sons) {
                            }
                            else{
                                parent.sons=[];
                            }
                            parent.sons.push(student);
                            parent.save(function(err,parent){
                                if(err){
                                    res.json({success:0,msg:config.msg.db});
                                    return console.log(err);
                                }
                                //将student存入grade表
                                if(grade.students){
                                }
                                else{
                                    grade.students=[];
                                }
                                grade.students.push(student);
                                grade.save(function(err,parent){
                                    if(err){
                                        res.json({success:0,msg:config.msg.db});
                                        return console.log(err);
                                    }
                                    res.json({success:1,msg:config.msg.success})
                                });
                            })

                        });
                    }
                });
            });
        }
        else{
            res.json({success:0,msg:config.msg.notexists})
        }
    });
}