/**
 * Created by Administrator on 2016/6/6.
 */
var School=require('../models/school');
var User=require('../models/user');
var Grade=require('../models/grade');
var Role=require('../models/role');
var _=require('underscore');

exports.grade_list=function(req,res){
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
            //学校存在
            Grade.find({status:true,school:schoolid})
                .populate({
                    path:'users'
                })
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
            res.redirect('/admin/school_select');
        }
    });
}

exports.grade=function(req,res){
    var sid=req.session.schoolnow.id;
    var id=req.params.id;
    School.findOne({status:true,_id:sid},function(err,school){
        if(err)
            return console.log(err);
        if(school){
            if(id){
                Grade.findOne({status:true,_id:id})
                    .exec(function(err,grade) {
                        if (err) {
                            err.status = 500;
                            res.render('error', {
                                message: err.name,
                                error: err
                            })
                            return console.log(err);
                        }
                        if (grade) {
                            res.render('./pages/grade/grade_edit', {
                                title: '编辑班级信息',
                                grade: grade,
                                sid: school._id,
                                action: '编辑',
                                school: school
                            });
                        }
                        else {
                            res.redirect('/admin/grade/list?sid=' + sid);
                        }
                    });
            }
            else{
                res.render('./pages/grade/grade',{
                    title:'新建班级信息',
                    grade:{},
                    sid:school._id,
                    action:'新建',
                    school:school
                });
            }


        }
        else{
            res.redirect('/admin/school_select');
        }
    });
}

exports.new=function(req,res){
    var id=req.body.id;
    var sid=req.body.sid;
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
            //如果学校存在
            var gradeObj={
                status:true,
                position:req.body.position,
                school:school,
                name:req.body.name
            }
            if(id){
                Grade.findById({status:true,_id:id},function(err,grade){
                    if(err){
                        err.status=500;
                        res.render('error',{
                            message:err.name,
                            error:err
                        })
                        return console.log(err);
                    }
                    var _grade= _.extend(grade,gradeObj);
                    _grade.save(function(err,grade){
                        if(err){
                            err.status=500;
                            res.render('error',{
                                message:err.name,
                                error:err
                            })
                            return console.log(err);
                        }
                        //school的grades列应该有这个班级

                        res.redirect('/admin/grade/list');
                    });
                });
            }
            else{
                var _grade=new Grade(gradeObj);
                _grade.save(function(err,grade){
                    if(err){
                        err.status=500;
                        res.render('error',{
                            message:err.name,
                            error:err
                        })
                        return console.log(err);
                    }
                    res.redirect('/admin/grade/list?sid='+school._id);
                });
            }
        }
        else{
            res.redirect('/admin/role/list?err=snotexist');
        }
    });
}
