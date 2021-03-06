/**
 * Created by liumeng on 2016/5/31.
 */
var mongoose = require('mongoose')
var Schema =mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;
var bcrypt = require('bcrypt-node')
var SALT_WORK_FACTOR = 10

var PresidentSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    status:Boolean,
    phone:String,
    email:String,
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
    schools:[
        {
            type:ObjectId,
            ref:'school'
        }
    ]
})

PresidentSchema.pre('save', function(next) {
    var user = this;
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
        this.meta.updateAt = Date.now()
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err)
        bcrypt.hash(user.password, salt, function(){},function(err, hash) {
            if (err) return next(err)

            user.password = hash;
            next();
        })
    })
})

PresidentSchema.methods = {
    comparePassword: function(_password, cb) {
        bcrypt.compare(_password, this.password, function(err, isMatch) {
            if (err) return cb(err)

            cb(null, isMatch)
        })
    }
}

PresidentSchema.statics = {
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

module.exports = PresidentSchema;