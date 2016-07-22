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