/**
 * Created by Administrator on 2016/6/27.
 */
var User=require('../../models/user');
var _=require('underscore');

exports.signin=function(req,res){
    var username=req.query.username;
    var password=req.query.password;
    if(username&&username!="") {
        User.findOne({name: username}, function (err, user) {
            if (err) {
                res.json({success: 0, msg: '数据库访问失败'});
                return console.log(err);
            }
            if (!user) {
                res.json({success: 0, msg: '用户名不存在'});
            }
            else {
                user.comparePassword(password, user.password, function (err, isMatch) {
                    if (err) {
                        res.json({success: 0, msg: '数据库访问失败'});
                        return console.log(err);
                    }
                    if (isMatch) {
                        req.session.user = user
                        res.json({success: 1});
                    }
                    else {
                        res.json({success: 0, msg: '用户名和密码不匹配'});
                    }
                });
            }
        })
    }
    else{
        res.json({success: 0, msg: '用户名不能为空'});
    }
}

exports.signup=function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    var userObj={
        name:req.body.name,
        password:req.body.password,
        status:true,
        isWorker:false
    }
    var _user=new User(userObj);
    _user.save(function(err,user){
        if(err){
            res.json({success:0,msg:'数据库访问错误'});
            return console.log(err);
        }
        res.json({success:1,user:user});
    });
}