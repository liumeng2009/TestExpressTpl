/**
 * Created by Administrator on 2016/7/20.
 */
var mongoose=require('mongoose');
var ChatSchema = require('../schemas/chat')
var Chat = mongoose.model('chat', ChatSchema)
module.exports = Chat;