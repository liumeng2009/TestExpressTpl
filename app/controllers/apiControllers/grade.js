/**
 * Created by Administrator on 2016/7/15.
 */
var Grade=require('../../models/grade');
var User=require('../../models/user')
var config=require('../../../config');
var _=require('underscore');

exports.grade_list_by_school=function(req,res){
    var sid=req.query.id;
    Grade.find({status:true,school:sid})
        .exec(function(err,grades){
            if(err){
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.json({success:0,msg:config.msg.db});
                return console.log(err);
            }
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json({success:1,msg:config.msg.success,grades:grades});
        })
}