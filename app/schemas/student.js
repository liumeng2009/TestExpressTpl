/**
 * Created by Administrator on 2016/6/15.
 */
var mongoose = require('mongoose')
var Schema =mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;

var StudentSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    grade:{
        type:ObjectId,
        ref:'grade'
    },
    parent:{
        type:ObjectId,
        ref:'user'
    },
    status:Boolean,
    age:num,
    sex:String,
    health:String,
    interest:String,
    state_now:String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

StudentSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
        this.meta.updateAt = Date.now()
    }
    next();
})


StudentSchema.statics = {
    fetch: function(cb) {
        return this
            .find({status:true})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function(id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    }
}

module.exports = StudentSchema