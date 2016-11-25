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
            Chat.find({to:userid})
                .find({saw:{'$ne':users[0].phoneId}})
                .populate('from')
                .exec(function(error,chats){
                    if(err){
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.json({success:0,msg:config.msg.db});
                        return console.log(err);
                    }
                    console.log('查到的消息是：'+JSON.stringify(chats));

                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.json({success:1,chats:chats});
                })

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