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
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
        this.meta.updateAt = Date.now()
    }
    console.log('111111111111111111');
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        console.log('22222222222222222222');
        if (err) return next(err)
        console.log(user.password);
        console.log(salt);
        bcrypt.hash(user.password, salt, function(err, hash) {
            console.log('3333333333333333');
            if (err) return next(err)

            user.password = hash;
            next();
        })
    })
})

AdminUserSchema.methods = {
    comparePassword: function(_password, cb) {
        bcrypt.compare(_password, this.password, function(err, isMatch) {
            if (err) return cb(err)

            cb(null, isMatch)
        })
    }
}

AdminUserSchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
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