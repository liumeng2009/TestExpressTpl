/**
 * Created by Administrator on 2016/5/31.
 */
var mongoose=require('mongoose');
var UserSchema = require('../schemas/user')
var User = mongoose.model('User', UserSchema)
module.exports = User;