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
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.json({success: 0, msg: '数据库访问失败1'});
                return console.log(err);
            }
            if (!user) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.json({success: 0, msg: '用户名不存在'});
            }
            else {
                console.log('验证密码');
                user.comparePassword(password, user.password, function (err, isMatch) {
                    if (err) {
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.json({success: 0, msg: '数据库访问失败2'+err});
                        return console.log(err);
                    }
                    if (isMatch) {
                        console.log('验证密码通过');
                        //生成token时，只取有用的user信息来签名，否则token会很长
                        var _tokenUser={
                            name:user.name,
                            password:user.password,
                            _id:user._id
                        };
                        var token=jwt.sign(_tokenUser,config.secret,{
                            expiresIn:'30 days'
                        });
                        console.log('生成的token是'+token);
                        user.token=token;
                        var date=new Date();
                        date.setDate(date.getDate()+1);
                        user.expiresIn=date;
                        user.save(function(err,user){
                            if(err){
                                res.setHeader('Access-Control-Allow-Origin', '*');
                                res.json({success: 0, msg: '数据库访问失败3'+err});
                                return console.log(err);
                            }
                            console.log('修改token成功');
                            res.setHeader('Access-Control-Allow-Origin', '*');
                            res.json({success: 1,msg:'登录成功',user:user});
                        });
                        //req.session.user = user
                    }
                    else {
                        console.log('验证密码不通过');
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.json({success: 0, msg: '用户名和密码不匹配'});
                    }
                });
            }
        })
    }
    else{
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({success: 0, msg: '用户名不能为空'});
    }
}

exports.signup=function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    User.findOne({name:username},function(err,user){
        if(err){
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods','POST');
            res.setHeader('Access-Control-Allow-Headers','x-requested-with,content-type');
            res.json({success:0,msg:config.msg.db});
            return console.log(err);
        }
        if(user){
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods','POST');
            res.setHeader('Access-Control-Allow-Headers','x-requested-with,content-type');
            res.json({success: 0,msg:config.msg.exists});
        }
        else{

            var userObj={
                name:username,
                password:password,
                status:true,
                isWorker:false
            }
            var _user=new User(userObj);
            _user.save(function(err,user){
                if(err){
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Methods','POST');
                    res.setHeader('Access-Control-Allow-Headers','x-requested-with,content-type');
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
                date.setDate(date.getDate()+30);
                user.expiresIn=date;
                user.save(function(err,user){
                    if(err){
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Methods','POST');
                        res.setHeader('Access-Control-Allow-Headers','x-requested-with,content-type');
                        res.json({success: 0, msg: '数据库访问失败3'+err});
                        return console.log(err);
                    }
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Methods','POST');
                    res.setHeader('Access-Control-Allow-Headers','x-requested-with,content-type');
                    res.json({success: 1,msg:'注册成功',token:token});
                });

            });
        }
    })

}

exports.baseInfo=function(req,res){
    var token=req.query.token;
    console.log('请求的token是：'+token);
    User.findOne({token:token,status:true})
        .populate('schools')
        .exec(function(err,user){
            if(err){
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.json({ success: 0,msg:config.msg.db });
                return console.log(err);
            }
            console.log(user);
            if(user){
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.json({success:1,user:user});
            }
            else{
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.json({success:0,msg:config.msg.notexists});
            }
        });
}

//验证token的中间件
exports.accesstoken=function(req,res,next){
    //检查post的信息或者url查询参数或者头信息
    var token = req.query.token;
    // 解析 token
    if (token) {
        // 确认token
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                return res.json({ success: 0, msg: '身份错误，请登录，不合法的token。' });

            } else {
                User.findOne({status:true,_id:decoded._id})
                    .deepPopulate(['roles.grade','roles.role'])
                    .exec(function(err,user){
                        if(err){
                            res.setHeader('Access-Control-Allow-Origin', '*');
                            return res.json({ success: 0, msg: '网络连接错误' });
                        }
                        if(user){
                            if(user.expiresIn){
                                var datenow=new Date();
                                var dateExIn=user.expiresIn;
                                if(dateExIn<datenow){
                                    res.setHeader('Access-Control-Allow-Origin', '*');
                                    return res.json({ success: 0, msg: '身份错误，请登录，token过期。' });
                                }else{
                                    req.app.locals.user=user;
                                    next();
                                }
                            }
                            else{
                                res.setHeader('Access-Control-Allow-Origin', '*');
                                return res.json({ success: 0, msg: '身份错误，请登录，不合法的有效期。' });
                            }
                        }
                        else{
                            res.setHeader('Access-Control-Allow-Origin', '*');
                            return res.json({ success: 0, msg: '身份错误，用户名不存在，请重新登陆。' });
                        }
                    });
            }
        });

    } else {
        res.setHeader('Access-Control-Allow-Origin', '*');
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
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.json({success:0,msg:FORBIDEN});
            }
            break;
        case '/school_add':
            if(user.isPresident){
                next();
            }
            else{
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.json({success:0,msg:FORBIDEN});
            }
            break;
        case '/school':
            next();
            break;
        default:
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json({success:0,msg:FORBIDEN});
            break;

    }
}

exports.user_by_id=function(req,res){
    var id=req.query.id;
    User.findOne({status:true,_id:id})
        .exec(function(err,user){
            if(err){
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.json({success:0,msg:config.msg.db});
                return console.log(err);
            }
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json({success:1,user:user});
        })
}

exports.check_online=function(req,res){
    var array=req.body.array;
    console.log('yyyyyyyyyyyyyyyyy'+JSON.stringify(array));
    var searchObj=[];
    for(var i=0;i<array.length;i++){
        var _s={_id:array[i]._id.toString()}
        searchObj.push(_s)
    }
    User.find({status:true})
        .or(searchObj)
        .exec(function(err,users){
            if(err){
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.json({success:0,msg:config.msg.db});
                return console.log(err);
            }
            res.setHeader('Access-Control-Allow-Origin', '*');
            var userArray=[];
            for(var i=0;i<users.length;i++){
                var _u={
                    _id:users[i]._id,
                    online:users[i].online
                }
                userArray.push(_u);
            }
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json({success:1,users:userArray});
        })
}

exports.setDeviceId=function(req,res){
    var deviceType=req.query.deviceType;
    var deviceid=req.query.deviceId;
    var token=req.query.token;
    switch(deviceType) {
        case "phone":
            User.find()
                .update({token:token},{$set:{phoneId:deviceid}},function(error,result){
                    if(error){
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.json({success: 0, msg:config.msg.db});
                        return console.log(error);
                    }
                    console.log('同步用户deviceid成功');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.json({success: 1, msg:config.msg.success});
                });
            break;
        default:
            User.find()
                .update({token:token},{$set:{phoneId:deviceid}},function(error,user){
                    if(error){
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.json({success: 0, msg:config.msg.db});
                        return console.log(err);
                    }
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.json({success: 1, msg:config.msg.success});
                });
            break;
    }

}