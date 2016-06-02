/**
 * Created by Administrator on 2016/5/31.
 */
var School=require('../models/school');
var President=require('../models/president');

exports.school=function(req,res){
    var id=req.query.id;
    President.find({status:true}).exec(function(err,presidents){
        if(err){
            console.log(err);
        }
        else{
            console.log("负责人列表是："+presidents);
            School.findById({_id:id},function(err,school){
                if(school){
                    res.render('./pages/school/school_edit',{
                        title:'编辑学校信息',
                        school:school,
                        action:'编辑',
                        presidents:presidents
                    });
                }
                else{
                    res.render('./pages/school/school',{
                        title:'新增学校',
                        school:[],
                        action:'新增',
                        presidents:presidents
                    });
                }
            });
        }
    });
}

exports.school_list=function(req,res){
    School.fetch(function(err,school){
        if(err){
            console.log(err);
        }
        else {
            if (school && school.length > 0) {
                res.render('./pages/school/school_list', {
                    title: '管理员列表',
                    schools: school
                });
            }
            else{
                res.render('./pages/school/school_list', {
                    title: '管理员列表',
                    schools: []
                });
            }
        }
    });
}

exports.new=function(req,res){
    var id=req.body._id;

    President.findById({_id:req.body.president},function(err,_pre){
        var schoolObj= {
            name: req.body.name,
            owner:_pre,
            status:true,
            province:req.body.province,
            city:req.body.city,
            country:req.body.country,
            address:req.body.address,
            intro:req.body.intro
        };

        //id存在就是编辑 不存在就是新增
        if(id){
            School.update({_id:id},{
                owner:_pre,
                province:schoolObj.province,
                city:schoolObj.city,
                country:schoolObj.country,
                address:schoolObj.address,
                intro:schoolObj.intro
            },function(err,school){
                if(err){
                    console.log(err)
                }
                else{
                    res.redirect('/admin/school/list');
                }
            });
        }
        else{
            School.find({name:schoolObj.name},function(err,school){
                if(err){
                    console.log(err);
                }
                else{
                    if(school&&school.length>0){
                        res.redirect('/admin/school?err=exist');
                    }else{
                        var __school=new School(schoolObj);
                        console.log('保存前：'+__school);
                        __school.save(function(err,school){
                            if(err){
                                console.log(err);
                            }
                            else{
                                res.redirect('/admin/school/list');
                            }
                        });
                    }
                }
            });
        }
    });


}
exports.del=function(req,res){

}