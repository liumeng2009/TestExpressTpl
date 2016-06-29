/**
 * Created by Administrator on 2016/6/27.
 */
var User=require('../../models/user');
var _=require('underscore');
var config=require('../../../config');
var jwt=require('jsonwebtoken');

exports.signin=function(req,res){
    var username=req.query.username;
    var password=req.query.password;
    if(username&&username!="") {
        User.findOne({name: username}, function (err, user) {
            if (err) {
                res.json({success: 0, msg: '数据库访问失败1'});
                return console.log(err);
            }
            if (!user) {
                res.json({success: 0, msg: '用户名不存在'});
            }
            else {
                user.comparePassword(password, user.password, function (err, isMatch) {
                    if (err) {
                        res.json({success: 0, msg: '数据库访问失败2'+err});
                        return console.log(err);
                    }
                    if (isMatch) {
                        var token=jwt.sign(user,config.secret,{
                            expiresIn:'1 days'
                        });
                        //req.session.user = user
                        res.json({success: 1,msg:'登录成功',token:token});
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

//验证token的中间件
exports.accesstoken=function(req,res,next){
    //检查post的信息或者url查询参数或者头信息
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    console.log(1111111111111111111111122222222222222222);
    // 解析 token
    if (token) {
        // 确认token
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'token信息错误.' });
            } else {
                // 如果没问题就把解码后的信息保存到请求中，供后面的路由使用
                req.decoded = decoded;
                for(var i in eval(decoded)){
                    console.log('属性是：'+i);
                }
                console.log('这是什么东西'+decoded._doc);
                next();
            }
        });

    } else {

        // 如果没有token，则返回错误
        return res.status(403).send({
            success: false,
            message: '没有提供token！'
        });

    }
}