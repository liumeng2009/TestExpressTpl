/**
 * Created by Administrator on 2016/5/31.
 */
var mongoose = require('mongoose')
var Schema =mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;
var bcrypt = require('bcrypt-node')
var SALT_WORK_FACTOR = 10

var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    nickname:{
        type:String
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
    permissions:[
        {
            school:{
                type:ObjectId,
                ref:'school'
            },
            grade:{
                type:ObjectId,
                ref:'grade'
            },
            role:{
                type:ObjectId,
                ref:'role'
            }
        }
    ],
    schools:[
        {
            type:ObjectId,
            ref:'school'
        }
    ],
    sons:[
        {
            type:ObjectId,
            ref:'student'
        }
    ],
    isWorker:Boolean,
    isPresident:Boolean,
    token:String,
    expiresIn:Date
})

UserSchema.pre('save', function(next) {
    var user = this;
    if (this.isNew||user.resetPwd) {
        this.meta.createAt = this.meta.updateAt = Date.now();
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) return next(err)
            bcrypt.hash(user.password, salt, function(){},function(err, hash) {
                if (err) return next(err)
                user.password = hash;
                console.log('user对象是：'+user);
                next();
            })
        })
    }
    else {
        this.meta.updateAt = Date.now()
        next();
    }
})

UserSchema.methods = {
    comparePassword: function(password,_password,cb) {
        console.log('password:'+password);
        console.log('_password'+_password);
        bcrypt.compare(password, _password, function(err, isMatch) {
            if (err) return cb(err)
            console.log(_password);

            cb(null, isMatch)
        })
    }
}

UserSchema.statics = {
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

module.exports = UserSchema