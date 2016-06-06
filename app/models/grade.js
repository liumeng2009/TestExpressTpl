/**
 * Created by Administrator on 2016/6/6.
 */
var mongoose=require('mongoose');
var GradeSchema = require('../schemas/grade')
var Grade = mongoose.model('grade', GradeSchema)
module.exports = Grade;