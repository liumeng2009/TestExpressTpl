/**
 * Created by Administrator on 2016/6/6.
 */
var School=require('../models/school');
var President=require('../models/president');
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
    var gid=req.query.gid;
    Grade.findOne({status:true,_id:gid},function(err,grade){

        console.log('查询出的班级是:'+grade);

        if(err)
            return console.log(err);
        if(grade){
            School.find({status:true},function(err,schools){
                if(err)
                    return console.log(err);
                res.render('./pages/grade/grade_edit',{
                    title:'编辑班级',
                    schools:schools,
                    action:'编辑',
                    grade:grade===null?[]:grade
                });
            });
        }
        else{
            var sid=req.query.sid;
            School.find({status:true},function(err,schools){
                if(err)
                    return console.log(err);
                var isExist=false;
                for(var i=0;i<schools.length;i++){
                    if(sid.toString()===schools[i]._id.toString()){
                        isExist=true;
                        break;
                    }
                }
                if(isExist){
                    res.render('./pages/grade/grade',{
                        title:'新建班级',
                        schools:schools,
                        action:'新建',
                        schid:sid,
                        grade:grade===null?[]:grade
                    });
                }
                else{
                    res.render('./pages/grade/grade',{
                        title:'新建班级',
                        schools:schools,
                        action:'新建',
                        grade:grade===null?[]:grade
                    });
                }
            });
        }
    })
}