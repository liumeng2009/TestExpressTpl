/**
 * Created by Administrator on 2016/7/22.
 */
var Chat=require('../../models/chat');
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
    var user=req.app.locals.user;
    Chat.find({to:user._id.toString(),status:0})
        .populate('from')
        .populate('to')
        .sort({'_id':-1})
        .exec(function(err,chats){
            if(err){
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.json({success:0,msg:config.msg.db});
                return console.log(err);
            }
            //去掉from重复的情况
            var _chats=[];
            var _count=[];
            for(var i=0;i<chats.length;i++){
                if(i===0){
                    var chat={
                        from:chats[i].from,
                        to:chats[i].to,
                        meta:chats[i].meta,
                        content:[
                            chats[i].content
                        ]
                    }
                    _chats.push(chat);
                }
                else{
                    for(var j=0;j<_chats.length;j++){
                        if(chats[i].from._id===_chats[j].from._id){
                            _chats[j].content.push(chats[i].content);
                        }
                        else{
                            if(j===_chats.length-1){
                                var chat={
                                    from:chats[i].from,
                                    to:chats[i].to,
                                    meta:chats[i].meta,
                                    content:[
                                        chats[i].content
                                    ]
                                }
                                _chats.push(chat);
                            }
                        }
                    }
                }
            }
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json({success:1,chats:_chats})
        });
}