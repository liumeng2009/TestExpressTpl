/**
 * Created by Administrator on 2016/5/26.
 */
var AdminUser=require('../models/admin_user');

exports.admin_user_list=function(req,res){

    AdminUser.fetch(function(err,adminUsers){
        if(err){
            res.render('./pages/user/admin_list',{
                title:'管理员列表',
                err:err
            });
        }
        else{
            res.render('./pages/user/admin_list',{
                title:'管理员列表',
                admin_user:adminUser
            });
        }
    });

}
exports.admin_user=function(req,res){
    var id=req.params.id;
    AdminUser.findById({_id:id},function(err,adminUser){
        if(adminUser&&adminUser.length>0){
            res.render('./pages/users/admin',{
                title:'编辑管理员',
                admin_ser:adminUser,
                action:'编辑'
            });
        }
        else{
            res.render('./pages/users/admin',{
                title:'新增管理员',
                admin_user:[],
                action:'新增'
            });
        }
    });
}

exports.new=function(req,res){
    var id=req.body._id;
    var adminUserObj={
        name:req.body.name,
        password:req.body.password,
        status:true,
        phone:req.body.phone,
        email:req.body.email
    }

    AdminUser.find({name:adminUserObj.name},function(err,adminuser){
        if(err){
            res.render('./pages/users/admin',{
                title:'新增管理员',
                admin_user:[],
                action:'新增',
                opinfo:{
                    error:err
                }
            });
        }
        else{
            if(adminuser&&adminuser.length>0){
                res.render('./pages/users/admin',{
                    title:'新增管理员',
                    admin_user:[],
                    action:'新增',
                    opinfo:{
                        error:'该用户已存在'
                    }
                });

            }else{
                var adminuser=new AdminUser(adminUserObj);
                adminuser.save(function(err,user){
                    if(err){
                        res.render('./pages/users/admin',{
                            title:'新增管理员',
                            admin_user:[],
                            action:'新增',
                            opinfo:{
                                error:err
                            }
                        });
                    }
                    else{
                        res.redirect('/admin/admin/list');
                    }
                });
            }
        }
    })



    var movieObj=req.body.movie;
    var _movie=emptyMovie;



    if(id){
        Movie.findById(id,function(err,movie){
            if(err){
                console.log(err);
            }
            _movie= _.extend(movie,movieObj);
            //res.send('对象underscore:'+_);
            //res.send('对象movie:'+movieObj);
            _movie.save(function(err,movie){
                if(err){
                    console.log(err);
                }
                res.redirect('/movie/'+movie._id);
            });
        });
    }
    else{
        _movie=new Movie(movieObj);
        var categoryId=movieObj.category;
        console.log('我选择的是这个分类：'+categoryId);
        _movie.save(function(err,movie){
            if(err){
                res.send(err);
            }
            else {
                Category.findById(categoryId,function(err,category){
                    if(err){
                        console.log(err);
                    }
                    else{
                        category.movies.push(movie._id);
                        category.save(function(err,category){
                            if(err){

                            }
                            else{
                                res.redirect('/movie/' + movie._id);
                            }
                        });
                    }


                });


            }
        });
    }
}

