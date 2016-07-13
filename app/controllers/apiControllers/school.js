/**
 * Created by liumeng on 2016/7/11.
 */
var School=require('../../models/school');
var User=require('../../models/user')
var config=require('../../../config');
var _=require('underscore');

exports.school_list=function(req,res){
    var user=req.app.locals.user;
    if(user){
        School.find({status:true,owner:user._id.toString()})
            .populate('owner')
            .exec(function(err,schools){
                if(err){
                    res.json({success:0,msg:config.msg.db});
                    return console.log(err);
                }
                else{
                    res.json({success:1,msg:config.msg.success,schools:schools})
                }
            });
    }
    else{
        res.json({success:0,msg:config.msg.notexists});
    }
}

exports.school=function(req,res){
    var id=req.query.id;
    School.findOne({status:true,_id:id},function(err,school){
        if(err){
            res.json({success:0,msg:config.msg.db});
            return console.log(err);
        }
        res.json({success:1,msg:config.msg.success,school:school});
    })
}

exports.new=function(req,res){
    var user=req.app.locals.user;
    var name=req.body.name;
    var id=req.body.id;
    var schoolObj={
        name:req.body.name,
        owner:user,
        province:req.body.province,
        city:req.body.city,
        country:req.body.country,
        address:req.body.address,
        intro:req.body.intro
    }
    if(id){
        //编辑
        School.find({status:true,_id:id},function(err,school){
            if(err){
                res.json({success:0,msg:config.msg.db});
                return console.log(err);
            }
            if(school){
                var _school= _.extend(school,schoolObj);
                _school.save(function(err,school){
                    if(err){
                        res.json({success:0,msg:msg.msgConfig.db});
                        return console.log(err);
                    }
                    //检查user中是否有这个school
                    if(user.schools.toString().indexOf(school._id.toString())>-1){
                        res.json({success:1,msg:config.msg.success});
                    }
                    else{
                        user.schools.push(school);
                        user.save(function(err,user){
                            if(err){
                                res.json({success:0,msg:config.msg.db});
                                return console.log(err);
                            }
                            res.json({success:1,msg:config.msg.success});
                        });
                    }
                })
            }
            else{
                res.json({success:0,msg:config.msg.notexists});
                return console.log(err);
            }
        })
    }
    else{
        //新增
        var _school=new School(schoolObj);
        _school.save(function(err,school){
            if(err){
                res.json({success:0,msg:config.msg.db});
                return console.log(err);
            }
            user.schools.push(school);
            user.save(function(err,user){
                if(err){
                    res.json({success:0,msg:config.msg.db});
                    return console.log(err);
                }
                res.json({success:1,msg:config.msg.success});
            });
        })
    }

}
