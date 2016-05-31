/**
 * Created by Administrator on 2016/5/31.
 */
var School=require('../models/school');
exports.school=function(req,res){
    var id=req.query.id;
    School.findById({_id:id},function(err,school){
        if(school){
            res.render('./pages/school/school_edit',{
                title:'编辑学校信息',
                school:school,
                action:'编辑'
            });
        }
        else{
            res.render('./pages/school/school',{
                title:'新增学校',
                school:[],
                action:'新增'
            });
        }
    });
}

exports.school_list=function(req,res){
    School.fetch(function(err,school){
        if(err){
            console.log(err);
        }
        else{
            res.render('./pages/school/school_list',{
                title:'管理员列表',
                admin_users:school
            });
        }
    });
}