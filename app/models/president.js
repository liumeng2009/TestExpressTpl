/**
 * Created by Administrator on 2016/6/1.
 */
var mongoose=require('mongoose');
var PresidentSchema = require('../schemas/president')
var President = mongoose.model('president', PresidentSchema)
module.exports = President;