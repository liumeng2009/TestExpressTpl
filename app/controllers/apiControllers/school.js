/**
 * Created by liumeng on 2016/7/11.
 */
var School=require('../../models/school');
var User=require('../../models/user')
var _=require('underscore');

exports.school_list=function(req,res){
    var token=req.query.token;
    User.findOne({status:true,token:token},function(err,user){
        if(err){
            res.json({success:0,msg:'网络连接错误'});
            return console.log(err);
        }
        if(user){
            School.find({status:true,owner:user._id.toString()})
                .populate('owner')
                .exec(function(err,schools){
                    if(err){
                        res.json({success:0,msg:'网络连接错误'});
                        return console.log(err);
                    }
                    else{
                        res.json({success:1,msg:'成功',schools:schools})
                    }
                });
        }
        else{
            res.json({success:0,msg:'身份错误'});
        }
    })
}

exports.new=function(req,res){
    var name=req.body.name;
    var schoolObj={
        name:req.body.name,
        province:req.body.province,
        city:req.body.city,
        country:req.body.country,
        address:req.body.address,
        intro:req.body.intro
    }
}
