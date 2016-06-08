/**
 * Created by Administrator on 2016/6/6.
 */
var mongoose = require('mongoose')
var Schema =mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;

var RoleSchema = new mongoose.Schema({
    name: {
        type: String
    },
    school:{
        type:ObjectId,
        ref:'school'
    },
    status:Boolean,
    functions:[
        {
            name:String,
            index:String,
            actions:{
                create:Boolean,
                delete:Boolean,
                show:Boolean,
                edit:Boolean,
                confirm:Boolean
            }
        }
    ],
    users:[
        {
            type:ObjectId,
            ref:'user'
        }
    ],
    weight:Number,
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

RoleSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
        this.meta.updateAt = Date.now()
    }
    next();
})


RoleSchema.statics = {
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

module.exports = RoleSchema;
