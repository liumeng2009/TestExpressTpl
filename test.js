/**
 * Created by Administrator on 2016/6/2.
 */
var mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1:12345/dbIM');

var User=mongoose.model('User',{
    name:String
});

var Book=mongoose.model('Book',{
    name:String,
    author:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    }
});

var user=new User({
    name:'liumeng'
});

var book=new Book({
    name:'小李飞刀',
    author:user
});

user.save(function(err){
    if(err)
        return console.log(err);
    console.log('保存之前：'+book);
    book.save({},function(err){
        if(err)
            return console.log(err);
    });

    Book.findOne().populate('author').exec(function(err,book){
        console.log('after populate:',err,book);
    });

});