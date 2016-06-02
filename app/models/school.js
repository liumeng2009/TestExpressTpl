/**
 * Created by Administrator on 2016/5/31.
 */
var mongoose=require('mongoose');
var SchoolSchema = require('../schemas/school')
var School = mongoose.model('School', SchoolSchema)
module.exports = School;