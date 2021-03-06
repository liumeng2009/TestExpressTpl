/**
 * Created by Administrator on 2016/5/25.
 */
var mongoose = require('mongoose')
var bcrypt = require('bcrypt-node')
var SALT_WORK_FACTOR = 10

var AdminUserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    status:Boolean,
    phone:String,
    email:String,
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

AdminUserSchema.pre('save', function(next) {
    var user = this;

    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) return next(err)
            bcrypt.hash(user.password, salt, function(){},function(err, hash) {
                if (err) return next(err)

                user.password = hash;
                next();
            })
        });
    }
    else {
        this.meta.updateAt = Date.now()
        next();
    }
})

AdminUserSchema.methods = {
    comparePassword: function(_password,__password, cb) {
        bcrypt.compare(_password, __password, function(err, isMatch) {
            if (err) return cb(err)
            cb(null, isMatch);
        })
    }
}

AdminUserSchema.statics = {
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

module.exports = AdminUserSchema