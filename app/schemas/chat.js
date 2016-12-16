/**
 * Created by Administrator on 2016/7/20.
 */
var mongoose = require('mongoose')
var ObjectId=mongoose.Schema.Types.ObjectId;

var ChatSchema = new mongoose.Schema({
    from: {
        type: ObjectId,
        ref: 'user'
    },
    to: {
        type:ObjectId,
        ref:'user'
    },
    timeid:String,
    content:String,
    //status:0 代表发送失败
    //status:1 代表发送成功
    status:Number,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    },
    //发送的设备标识
    send:String,
    //接收的设备标识
    saw:String
})

ChatSchema.pre('save', function(next) {
    var user = this;
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }
    else {
        this.meta.updateAt = Date.now()
    }
    next();
})

ChatSchema.statics = {
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

module.exports = ChatSchema