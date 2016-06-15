/**
 * Created by Administrator on 2016/6/15.
 */
var mongoose=require('mongoose');
var StudentSchema = require('../schemas/student');
var Student = mongoose.model('student', StudentSchema);
module.exports = Student;