/**
 * Created by Administrator on 2016/6/15.
 */
var School=require('../models/school');
var Student=require('../models/student');
var Grade=require('../models/grade');
var User=require('../models/user');
var _=require('underscore');

exports.student_list=function(req,res){
    var sid=req.session.schoolnow.id;
    School.findOne({status:true,_id:sid},function(err,school){
        if(err)
            return console.log(err);
        if(school){
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
            res.redirect('/admin/school_select');
        }
    });
}
exports.student=function(req,res){
    var sid=req.query.sid;
    var id=req.params.id;
    School.findOne({status:true,_id:sid},function(err,school){
        if(err){
            err.status = 500;
            res.render('error', {
                message: err.name,
                error: err
            })
            return console.log(err);
        }
        if(school){
            Grade.find({status:true,school:school._id},function(err,grades){
                if(err){
                    err.status = 500;
                    res.render('error', {
                        message: err.name,
                        error: err
                    })
                    return console.log(err);
                }
                User.find({status:true},function(err,users){
                    if(err){
                        err.status = 500;
                        res.render('error', {
                            message: err.name,
                            error: err
                        })
                        return console.log(err);
                    }
                    if(id){
                        Student.findById({status:true,_id:id},function(err,student){
                            if(err){
                                err.status = 500;
                                res.render('error', {
                                    message: err.name,
                                    error: err
                                })
                                return console.log(err);
                            }
                            res.render('./pages/student/student_edit',{
                                title:'编辑学生信息',
                                action:'编辑',
                                school:school,
                                grades:grades,
                                parents:users,
                                sid:school._id,
                                student:student
                            });
                        });
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
    console.log('6666666666'+id);
    School.findById({status:true,_id:sid},function(err,school){
        if(err){
            err.status = 500;
            res.render('error', {
                message: err.name,
                error: err
            })
            return console.log(err);
        }
        if(school){
            Grade.findOne({status:true,_id:gid},function(err,grade){
                if(err){
                    err.status = 500;
                    res.render('error', {
                        message: err.name,
                        error: err
                    })
                    return console.log(err);
                }
                User.findOne({status:true,_id:pid},function(err,parent){
                    if(err){
                        err.status = 500;
                        res.render('error', {
                            message: err.name,
                            error: err
                        })
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
                                    err.status = 500;
                                    res.render('error', {
                                        message: err.name,
                                        error: err
                                    })
                                    return console.log(err);
                                }
                                console.log('学生是：'+student);
                                if(student){
                                    var _student= _.extend(student,studentObj);
                                    _student.save(function(err,student){
                                        if(err){
                                            err.status = 500;
                                            res.render('error', {
                                                message: err.name,
                                                error: err
                                            })
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
                                                err.status = 500;
                                                res.render('error', {
                                                    message: err.name,
                                                    error: err
                                                })
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
                                                    err.status = 500;
                                                    res.render('error', {
                                                        message: err.name,
                                                        error: err
                                                    })
                                                    return console.log(err);
                                                }
                                                res.redirect('/admin/student/list?sid='+school._id);
                                            });
                                        });
                                    });
                                }
                                else{
                                    res.redirect('/admin/student/list?sid='+school._id);
                                }
                            })
                        }
                        else{
                            var _student=new Student(studentObj);
                            _student.save(function(err,student){
                                if(err){
                                    err.status = 500;
                                    res.render('error', {
                                        message: err.name,
                                        error: err
                                    })
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
                                        err.status = 500;
                                        res.render('error', {
                                            message: err.name,
                                            error: err
                                        })
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
                                            err.status = 500;
                                            res.render('error', {
                                                message: err.name,
                                                error: err
                                            })
                                            return console.log(err);
                                        }
                                        res.redirect('/admin/student/list?sid='+school._id);
                                    });
                                })

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
exports.delete=function(req,res){
    var id=req.query.id;
    if(id){
        Student.findById({status:true,_id:id},function(err,student){
            if(err){
                res.json({success:0,info:'数据库读取失败'});
                return console.log(err);
            }
            if(student){
                Student.update({_id:id},{$set:{status:false}},function(err){
                    if(err){
                        res.json({success:0,info:'数据库读取失败'});
                        return console.log(err);
                    }
                    //删除student在grade里面的记录
                    console.log('student是'+student);
                    Grade.findById({_id:student.grade.toString()},function(err,grade){
                        if(err){
                            res.json({success:0,info:'数据库读取失败'});
                            return console.log(err);
                        }
                        for(var i=0;i<grade.students.length;i++){
                            console.log('轮询：'+grade.students[i].toString());
                            if(grade.students[i].toString()===student._id.toString()){
                                grade.students.splice(i,1);
                            }
                        }
                        grade.save(function(err){
                            if(err){
                                res.json({success:0,info:'数据库读取失败'});
                                return console.log(err);
                            }
                            //删除student在user里面的记录
                            User.findById({_id:student.parent.toString()},function(err,user){
                                if(err){
                                    res.json({success:0,info:'数据库读取失败'});
                                    return console.log(err);
                                }
                                for(var i=0;i<user.sons.length;i++){
                                    console.log('轮询：'+user.sons[i].toString());
                                    if(user.sons[i].toString()===student._id.toString()){
                                        user.sons.splice(i,1);
                                    }
                                }
                                user.save(function(err,user){
                                    if(err){
                                        res.json({success:0,info:'数据库读取失败'});
                                        return console.log(err);
                                    }
                                    res.json({success:1})
                                });
                            })
                        })
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