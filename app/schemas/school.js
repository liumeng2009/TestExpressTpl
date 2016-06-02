/**
 * Created by Administrator on 2016/5/31.
 */
var mongoose = require('mongoose')
var Schema =mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;

var SchoolSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    province: String,
    city:String,
    country:String,
    address:String,
    owner:{
        type:ObjectId,
        ref:'President'
    },
    status:Boolean,
    intro:String,
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

SchoolSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
        this.meta.updateAt = Date.now()
    }
    next();
})


SchoolSchema.statics = {
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

module.exports = SchoolSchema