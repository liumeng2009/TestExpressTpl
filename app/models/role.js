/**
 * Created by Administrator on 2016/6/6.
 */
var mongoose=require('mongoose');
var RoleSchema = require('../schemas/role')
var Role = mongoose.model('role', RoleSchema)
module.exports = Role;