/**
 * Created by Administrator on 2016/7/22.
 */
//在线聊天模块
var onlineUsers={};
var onlineCount=0;
socket.listen(server).on('connection',function(socketio){
    socketio.on('login',function(obj){
        socketio.name=obj;
        if(!onlineUsers.hasOwnProperty(obj)) {
            onlineUsers[obj] = {
                username:obj,
                socket: socketio
            };
            onlineCount++;
        }
        console.log(socketio.name+'登录成功');
    });
    socketio.on('disconnect',function(){
        if(onlineUsers.hasOwnProperty(socketio.name)) {
            //删除
            delete onlineUsers[socketio.name];
            //在线人数-1
            console.log(socketio.name+'退出');
        }
    });
    socketio.on('message',function(obj){
        console.log(obj);
        console.log(obj.username+'说',obj.content);
        socketio.emit('to',obj);
    });
});

iosocket = io.connect('http://localhost:3000');

iosocket.emit('login', 'liumeng');

iosocket.on('connect',function(){

});