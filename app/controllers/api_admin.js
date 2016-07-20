/**
 * Created by Administrator on 2016/6/21.
 */
var fs=require('fs');
var path=require('path');
var socket=require('socket.io')
exports.uploadify=function(req,res){
    var posterData=req.files['Filedata'];
    var filepath=posterData.path;
    var originalFilename=posterData.originalFilename;
    if(originalFilename){
        fs.readFile(filepath,function(err,data){
            var timertamp=Date.now();
            var names=posterData.name.split('.');
            var type=names[names.length-1];
            var poster=timertamp+'.'+type;
            var newPath=path.join(__dirname,'../../','upload/'+poster);
            console.log(newPath);
            fs.writeFile(newPath,data,function(err){
                if(err){
                    return res.send('error');
                }
                req.poster=poster;
                res.json({path:poster});
            });
        });
    }
    else{
        res.send('Invalid file type');
    }
}

var onlineUsers={};
var onlineCount=0;
exports.chat=function(server){
    socket.listen(server).on('connection',function(socketio){
        console.log('a user connected');

        socketio.on('login',function(obj){
            socketio.name=obj.userid;

            if(!onlineUsers.hasOwnProperty(obj.username)){
                onlineUsers[obj.username]={
                    name:obj.username,
                    socket:socketio
                };
                onlineCount++;
            }

            socketio.emit('login',{onlineCount:onlineCount,user:obj});
            console.log(obj.username+'加入了聊天室');

        });

        socketio.on('disconnect',function(){
            //将退出的用户从在线列表中删除
            if(onlineUsers.hasOwnProperty(socket.name)) {
                //退出用户的信息
                var obj = {userid:socket.name, username:onlineUsers[socket.name]};

                //删除
                delete onlineUsers[socket.name];
                //在线人数-1
                onlineCount--;

                //向所有客户端广播用户退出
                socketio.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
                console.log(obj.username+'退出了聊天室');
            }
        });

        socketio.on('private message', function (from,to,msg) {

            console.log('I received a private message by ', from, ' say to ',to, msg);

            for(var p in onlineUsers){
                console.log(p);
                if(p===to){
                    console.log(to+'在线');
                    console.log('发送事件名称是：'+'to'+to);
                    onlineUsers[to].socket.emit('to'+to, {mess:msg,from:from});
                }
            }
        });


        socketio.on('message',function(obj){
            console.log(obj);
            console.log(obj.username+'说',obj.content);
            socketio.broadcast.emit('message',obj);
        });

    });
}