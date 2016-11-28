/**
 * Created by Administrator on 2016/7/22.
 */
var Chat=require('../../models/chat');
var User=require('../../models/user');
var config=require('../../../config');
exports.chat_list=function(req,res){
    var user=req.app.locals.user;
    Chat.find()
        .or([{from:user._id.toString()},{to:user._id.toString()}])
        .populate('from')
        .populate('to')
        .exec(function(err,chats){
            if(err){
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.json({success:0,msg:config.msg.db});
                return console.log(err);
            }
            res.setHeader('Access-Control-Allow-Origin', '*');
            //处理chats
            var relationUser={};
            for(var i=0;i<chats.length;i++){
                if(chats[i].from===user._id.toString()){

                }
            }
            res.json({success:1,chats:chats})
        });
}

var getRelationUser=function(obj,userid){
    if(obj.from.toString()===userid){
        return {
            user:obj.to,
            content:obj.content,
            time:obj.meta.createAt
        }
    }
    else if(obj.to.toString()===userid){
        return {
            user:obj.from,
            content:obj.content,
            time:obj.meta.createAt
        }
    }
}

exports.chat_not_read_list=function(req,res){
    //最近一周的，关于这个人的所有消息，他发的和接收到的
    //发的，不管saw的值，都拿过来
    //

    var token=req.query.token;
    User.find({token:token,status:true})
        .exec(function(err,users){
            if(err){
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.json({success:0,msg:config.msg.db});
                return console.log(err);
            }
            var userid=users[0]._id;
            var now=new Date();
            var year=now.getFullYear();
            var month=now.getMonth()+1;
            var day=now.getDate();
            var dateNow=new Date(year+'/'+month+'/'+day);
            var DateSevenAgo=new Date(dateNow.getTime()-7*24*60*60*1000);
            console.log(DateSevenAgo);

            //发给userid的，发送成功时间在7天内的，saw值不是当前设备标识的
            Chat.find({to:userid})
                .find({'meta.createAt':{'$gt':DateSevenAgo}})
                .find({saw:{'$ne':users[0].phoneId}})
                .populate('from')
                .populate('to')
                .exec(function(error,chatsTo){
                    if(err){
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.json({success:0,msg:config.msg.db});
                        return console.log(err);
                    }
                    console.log('查到的TO消息是：'+chatsTo.length);
                    //再找userid发送的，发送时间在7天内的，send值不是当前设备标识的
                    Chat.find({from:userid})
                        .find({'meta.createAt':{'$gt':DateSevenAgo}})
                        .find({send:{'$ne':users[0].phoneId}})
                        .populate('from')
                        .populate('to')
                        .exec(function(error,chatsFrom) {
                            if (err) {
                                res.setHeader('Access-Control-Allow-Origin', '*');
                                res.json({success: 0, msg: config.msg.db});
                                return console.log(err);
                            }
                            console.log('查到的FROM消息是：'+chatsFrom.length);
                            if(chatsTo.length===0&&chatsFrom.length===0){
                                console.log('最近一周都没有活动，就把一个月内最新的一条传过去');
                                var DateMonthAgo=new Date(dateNow.getTime()-30*24*60*60*1000);
                                Chat.find({'$or':[{from:userid},{to:userid}]})
                                    .find('meta.createAt',{'$gt':DateMonthAgo})
                                    .find({'$or':[{saw:{'$ne':users[0].phoneId}},{send:{'$ne':users[0].phoneId}}]})
                                    .populate('from')
                                    .populate('to')
                                    .exec(function(error,chatsLong){
                                        if(err){
                                            res.setHeader('Access-Control-Allow-Origin', '*');
                                            res.json({success: 0, msg: config.msg.db});
                                            return console.log(err);
                                        }
                                        console.log('查到的LONG消息是：'+chatsLong.length);
                                        var chatsAll=[];
                                        for(var i=0;i<chatsTo.length;i++){
                                            chatsAll.push(chatsTo[i]);
                                        }
                                        for(var i=0;i<chatsFrom.length;i++){
                                            chatsAll.push(chatsFrom[i]);
                                        }
                                        for(var i=0;i<chatsLong.length;i++){
                                            chatsAll.push(chatsLong[i]);
                                        }
                                        console.log('获得了'+chats.length+'条未读消息');
                                        res.setHeader('Access-Control-Allow-Origin', '*');
                                        res.json({success: 1, chats:chatsAll});
                                    })
                            }
                            else{
                                var chatsAll=[];
                                for(var i=0;i<chatsTo.length;i++){
                                    chatsAll.push(chatsTo[i]);
                                }
                                for(var i=0;i<chatsFrom.length;i++){
                                    chatsAll.push(chatsFrom[i]);
                                }
                                res.setHeader('Access-Control-Allow-Origin', '*');
                                res.json({success: 1, chats:chatsAll});
                            }
                        });
                });
            });
}

exports.chat_not_read_list_to=function(req,res){
    var user=req.app.locals.user;
    var fromid=req.query.fromid;
    Chat.find({to:user._id.toString(),status:0,from:fromid.toString()})
        .populate('from')
        .populate('to')
        .sort({'_id':-1})
        .exec(function(err,chats){
            if(err){
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.json({success:0,msg:config.msg.db});
                return console.log(err);
            }
            console.log(chats);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json({success:1,chats:chats})
        });
}
exports.chat_twelve_hours_ago=function(req,res){
    var user=req.app.locals.user;
    var fromid=req.query.fromid;
    var dw=new Date();
    dw.setHours(dw.getHours()-12);
    Chat.find({status:1})
        .or([{to:user._id.toString(),from:fromid.toString()},{from:user._id.toString(),to:fromid.toString()}])
        .gt('meta.createAt',dw)
        .populate('from')
        .populate('to')
        .sort({'_id':-1})
        .exec(function(err,chats){
            if(err){
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.json({success:0,msg:config.msg.db});
                return console.log(err);
            }
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json({success:1,chats:chats})
        });
}