/**
 * Created by Administrator on 2016/6/6.
 */
var mongoose = require('mongoose')
var Schema =mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;

var FunctionSchema = new mongoose.Schema({
    name: {
        type: String
    },
    index:{
        type:String
    },
    status:Boolean,
    actions:{
        show:{
            type:Boolean
        },
        edit:{
            type:Boolean
        },
        delete:{
            type:Boolean
        },
        create:{
            type:Boolean
        },
        confirm:{
            type:Boolean
        }
    },
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

FunctionSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
        this.meta.updateAt = Date.now()
    }
    next();
})


FunctionSchema.statics = {
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

module.exports = FunctionSchema;
