/**
 * Created by Administrator on 2016/5/31.
 */
var mongoose = require('mongoose')
var Schema =mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;

var GradeSchema = new mongoose.Schema({
    name: {
        type: String
    },
    school:{
        type:ObjectId,
        ref:'school'
    },
    status:Boolean,
    position:String,
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
    users:[
        {
            type:ObjectId,
            ref:'user'
        }
    ],
    students:[
        {
            type:ObjectId,
            ref:'student'
        }
    ]
})

GradeSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
        this.meta.updateAt = Date.now()
    }
    next();
})


GradeSchema.statics = {
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

module.exports = GradeSchema;
