/**
 * Created by liumeng on 2016/8/10.
 */
/*
var GeTui = require('../../lib/nodejsDemo.0.1.0/GT.push');
var Target = require('../../lib/nodejsDemo.0.1.0/getui/Target');
var BaseTemplate = require('../../lib/nodejsDemo.0.1.0/getui/template/BaseTemplate');
var TransmissionTemplate = require('../../lib/nodejsDemo.0.1.0/getui/template/TransmissionTemplate');
var AppMessage = require('../../lib/nodejsDemo.0.1.0/getui/message/AppMessage');

// http的域名
var HOST = 'http://sdk.open.api.igexin.com/apiex.htm';

//https的域名
//var HOST = 'https://api.getui.com/apiex.htm';

//定义常量, appId、appKey、masterSecret 采用本文档 "第二步 获取访问凭证 "中获得的应用配置
var APPID = 'zL5N4tiRqx8ROwcZq2p9B6';
var APPKEY = 'nS5XNg4Vp18m8Uq82nE9p9';
var MASTERSECRET = 'WZaet16gEn6yONgbReEII4';

var gt = new GeTui(HOST, APPKEY, MASTERSECRET);

pushMessageToApp();


function pushMessageToApp() {
    // var taskGroupName = 'test';
    var taskGroupName = null;
    // 定义"点击链接打开通知模板"，并设置透传内容，透传形式
    var template = TransmissionTemplateDemo();


    //定义"AppMessage"类型消息对象，设置消息内容模板、发送的目标App列表、是否支持离线发送、以及离线消息有效期(单位毫秒)
    var message = new AppMessage({
        isOffline: false,
        offlineExpireTime: 3600 * 12 * 1000,
        data: template,
        appIdList: [APPID],
//        phoneTypeList: ['IOS'],
//        provinceList: ['浙江'],
        //tagList: ['阿百川']
        speed: 10000
    });

    gt.pushMessageToApp(message, taskGroupName, function (err, res) {
        console.log(res);
    });
}
function TransmissionTemplateDemo() {
    var template =  new TransmissionTemplate({
        appId: APPID,
        appKey: APPKEY,
        transmissionType: 1,
        transmissionContent: '您输入的透传内容'
    });

    return template;
}
    */