/**
 * Created by Administrator on 2016/6/27.
 */
var User=require('../../models/user');
var UserSchema=require('../../schemas/user');
var _=require('underscore');
var config=require('../../../config');
var jwt=require('jsonwebtoken');
var mongoose=require('mongoose');
var deepPopulate=require('mongoose-deep-populate')(mongoose);
UserSchema.plugin(deepPopulate,{});

exports.signin=function(req,res){
    var username=req.query.username;
    var password=req.query.password;
    var redirecturl=req.query.redirecturl;
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
                        //生成token时，只取有用的user信息来签名，否则token会很长
                        var _tokenUser={
                            name:user.name,
                            password:user.password,
                            _id:user._id
                        };
                        var token=jwt.sign(_tokenUser,config.secret,{
                            expiresIn:'1 days'
                        });
                        user.token=token;
                        var date=new Date();
                        date.setDate(date.getDate()+1);
                        user.expiresIn=date;
                        user.save(function(err,user){
                            if(err){
                                res.json({success: 0, msg: '数据库访问失败3'+err});
                                return console.log(err);
                            }
                        });
                        res.json({success: 1,msg:'登录成功',token:token});
                        //req.session.user = user
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
        name:username,
        password:password,
        status:true,
        isWorker:false
    }
    var _user=new User(userObj);
    _user.save(function(err,user){
        if(err){
            res.json({success:0,msg:'数据库访问错误'});
            return console.log(err);
        }
        var _tokenUser={
            name:user.name,
            password:user.password,
            _id:user._id
        };
        var token=jwt.sign(_tokenUser,config.secret,{
            expiresIn:'1 days'
        });
        user.token=token;
        var date=new Date();
        date.setDate(date.getDate()+1);
        user.expiresIn=date;
        user.save(function(err,user){
            if(err){
                res.json({success: 0, msg: '数据库访问失败3'+err});
                return console.log(err);
            }
            res.json({success: 1,msg:'注册成功',token:token});
        });

    });
}

exports.baseInfo=function(req,res){
    var token=req.query.token;
    User.findOne({token:token,status:true})
        .populate('schools')
        .exec(function(err,user){
            if(err){
                return res.json({ success: 0, message: '数据库连接错误' });
            }
            console.log('8888888888888888'+token+user);
            if(user){
                console.log(user);
                res.json({success:1,user:user});
            }
            else{
                res.json({success:0});
            }
        });
}

//验证token的中间件
exports.accesstoken=function(req,res,next){
    //检查post的信息或者url查询参数或者头信息
    var token = req.query.token;
    console.log('rrrrrrrrrrrrrrrr'+token);
    // 解析 token
    if (token) {
        // 确认token
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                return res.json({ success: 0, msg: '身份错误，请登录，不合法的token。' });
            } else {
                for(var p in decoded){
                    console.log(p);
                }
                User.findOne({status:true,_id:decoded._id})
                    .deepPopulate(['roles.grade','roles.role'])
                    .exec(function(err,user){
                        if(err){
                            return res.json({ success: 0, msg: '网络连接错误' });
                        }
                        if(user){
                            if(user.expiresIn){
                                var datenow=new Date();
                                var dateExIn=user.expiresIn;
                                if(dateExIn<datenow){
                                    return res.json({ success: 0, msg: '身份错误，请登录，token过期。' });
                                }else{
                                    req.app.locals.user=user;
                                    next();
                                }
                            }
                            else{
                                return res.json({ success: 0, msg: '身份错误，请登录，不合法的有效期。' });
                            }
                        }
                        else{
                            return res.json({ success: 0, msg: '身份错误，用户名不存在，请重新登陆。' });
                        }
                    });
            }
        });

    } else {
        return res.json({ success: 0, msg: '身份错误，请登录，token不存在。' });

    }
}

//验证操作权限
exports.opration=function(req,res,next){
    var FORBIDEN='没有权限';
    var url=req.path;
    var user=req.app.locals.user;
    switch(url){
        case '/school_list':
            if(user.isPresident){
                next();
            }
            else{
                res.json({success:0,msg:FORBIDEN});
            }
            break;
        case '/school_add':
            if(user.isPresident){
                next();
            }
            else{
                res.json({success:0,msg:FORBIDEN});
            }
            break;
        case '/school':
            next();
            break;
        default:
            res.json({success:0,msg:FORBIDEN});
            break;

    }
}

exports.user_by_id=function(req,res){
    var id=req.query.id;
    User.findOne({status:true,_id:id})
        .exec(function(err,user){
            if(err){
                res.json({success:0,msg:config.msg.db});
                return console.log(err);
            }
        })
}