/**
 * Created by Administrator on 2016/6/6.
 */
var Role=require('../models/role');
var School=require('../models/school');

exports.role_list=function(req,res){
    var schoolid=req.query.sid;
    School.findOne({status:true,_id:schoolid},function(err,school){
        if(err)
            return console.log(err);
        if(school){
            //学校存在
            Role.find({status:true,school:schoolid},function(err,roles){
                res.render('./pages/role/role_list',{
                    title:school.name+" 角色列表",
                    roles:roles,
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
                    res.render('./pages/role/role_list', {
                        title: '请先选择学校',
                        schools: schools
                    });
                });
        }
    });
}