/**
 * Created by Administrator on 2016/5/31.
 */
var User=require('../models/user')

//用户列表
exports.user_list=function(req,res){
    User.fetch(function(err,user){
        if(err){
            console.log(err);
        }
        else{
            res.render('./pages/users/admin_list',{
                title:'用户列表',
                admin_users:user
            });
        }
    });
}

//用户信息
exports.user=function(req,res){
    var id=req.query.id;
    User.findById({_id:id},function(err,user){
        if(err){
            console.log(err);
        }
        else{
            if(adminUser){
                res.render('./pages/users/user_edit',{
                    title:'编辑用户',
                    admin_user:user,
                    action:'编辑'
                });
            }
            else{
                res.render('./pages/users/user',{
                    title:'新增用户',
                    admin_user:[],
                    action:'新增'
                });
            }
        }
    });
}