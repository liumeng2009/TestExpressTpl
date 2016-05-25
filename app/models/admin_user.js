/**
 * Created by liumeng on 2016/5/25.
 */
var mongoose=require('mongoose');
var AdminUserSchema = require('../schemas/admin_user')
var AdminUser = mongoose.model('User', AdminUserSchema)
module.exports = AdminUser;