/**
 * Created by Administrator on 2016/6/6.
 */
var mongoose=require('mongoose');
var FunctionSchema = require('../schemas/function');
var Function = mongoose.model('function', FunctionSchema);
module.exports = Function;