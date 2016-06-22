/**
 * Created by Administrator on 2016/6/1.
 */
var President=require('../models/president');
var _=require('underscore');

exports.president_list=function(req,res){
    President.find({status:true})
        .populate('schools')
        .exec(function(err,presidents) {
            if (err) {
                err.status = 500;
                res.render('error', {
                    message: err.name,
                    error: err
                })
                return console.log(err);
            }
            res.render('./pages/users/president_list',{
                title:'校长用户列表',
                presidents:presidents
            });
        });
}
//用户信息
exports.president=function(req,res){
    var id=req.query.id;
    President.findById({_id:id},function(err,president){
        if(president){
            res.render('./pages/users/president_edit',{
                title:'编辑管理员',
                president:president,
                action:'编辑'
            });
        }
        else{
            res.render('./pages/users/president',{
                title:'新增管理员',
                president:[],
                action:'新增'
            });
        }
    });
}
//新增用户
exports.new=function(req,res){
    var id=req.body._id;
    var presidentObj={
        name:req.body.name,
        password:req.body.password,
        status:true,
        phone:req.body.phone,
        email:req.body.email
    };
    //id存在就是编辑 不存在就是新增
    if(id){
        President.update({_id:id},{
            phone:req.body.phone,
            email:req.body.email
        },function(err,adminuser){
            if(err){
                console.log(err);
            }
            else{
                res.redirect('/admin/president/list');
            }
        });
    }
    else{
        President.find({name:presidentObj.name},function(err,president){
            if(err){
                console.log(err);
            }
            else{
                if(president&&president.length>0){
                    res.redirect('/admin/president?err=exist');
                }else{
                    var _president=new President(presidentObj);

                    console.log('增加的校长是：'+_president);

                    _president.save(function(err,user){
                        if(err){
                            console.log(err);
                        }
                        else{
                            res.redirect('/admin/president/list');
                        }
                    });
                }
            }
        });
    }
}

//删除用户
exports.del=function(req,res){
    var id=req.query.id;
    if(id){
        console.log('删除的id是:'+id);
        President.update({_id:id},{status:false},function(err){
            if(err){
                res.json({success:0,info:'数据库读取失败'});
                return console.log(err);
            }
            //这个用户下面的学校全部置否

                res.json({success:1});

        });
    }
}