/**
 * Created by Administrator on 2016/6/6.
 */
var School=require('../models/school');
var User=require('../models/user');
var Grade=require('../models/grade');

exports.grade_list=function(req,res){
    var schoolid=req.query.sid;
    console.log('学校id是：'+schoolid);
    School.findOne({status:true,_id:schoolid},function(err,school){
        if(err)
            return console.log(err);

        console.log('得到的学校对象是：'+school);

        if(school){
            //学校存在
            Grade.find({status:true,school:schoolid},function(err,grades){
                res.render('./pages/grade/grade_list',{
                    title:school.name+" 班级列表",
                    grades:grades,
                    school:school
                })
            });
        }
        else{
            School.find({status:true})
                .populate('owner')
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
            User.find({status:true,school:school._id},function(err,users){
                console.log('user对象是'+users+'sid是'+school._id);
                if(id){
                    //编辑模式
                    Grade.findOne({status:true,_id:id},function(err,grade){
                        res.render('./pages/grade/grade',{
                            title:'编辑班级信息',
                            grade:grade,
                            users:users,
                            sid:school._id,
                            action:'编辑'
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