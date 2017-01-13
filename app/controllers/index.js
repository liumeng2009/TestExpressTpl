/**
 * Created by Administrator on 2016/5/30.
 */
var fs=require('fs');
var path=require('path');

exports.adminIndex=function(req,res){
    res.render('./index',{
        title:'欢迎'
    });
}

exports.index=function(req,res){
    res.render('./pages/front/index',{
        title:'欢迎'
    });
}

exports.download=function(req,res){
    var path='../upload/android-debug.apk';
    // filename:设置下载时文件的文件名，可不填，则为原名称
    res.download(path, '');
}