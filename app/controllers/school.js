/**
 * Created by Administrator on 2016/5/31.
 */
//var mongoose=require('mongoose');
var School=require('../models/school');
var President=require('../models/president');

exports.school=function(req,res){
    var id=req.query.id;
    President.find({status:true}).exec(function(err,presidents){
        if(err){
            console.log(err);
        }
        else{
            console.log("负责人列表是："+presidents);
            School.findById({_id:id},function(err,school){
                if(school){
                    res.render('./pages/school/school_edit',{
                        title:'编辑学校信息',
                        school:school,
                        action:'编辑',
                        presidents:presidents
                    });
                }
                else{
                    res.render('./pages/school/school',{
                        title:'新增学校',
                        school:[],
                        action:'新增',
                        presidents:presidents
                    });
                }
            });
        }
    });
}

exports.school_list=function(req,res){
    var searchObj={};
    if(req.query.president&&req.query.president!=0){
        searchObj.owner=req.query.president;
    }
    if(req.query.name&&req.query.name!=""){
        searchObj.name=req.query.name;
    }
    searchObj.status=true;

    School.find(searchObj)
        .populate('owner')
        .exec(function(err,schools){
            if(err)
                return console.log(err);
            President.find({status:true},function(err,presidents){
                if(err)
                    return console.log(err);

                res.render('./pages/school/school_list',{
                    title:'管理员列表',
                    schools:schools,
                    presidents:presidents
                });
            })
        });
}

exports.new=function(req,res){
    var id=req.body._id;
    President.findById({_id:req.body.president},function(err,_pre){
        if(err)
            return console.log(err)

        var schoolObj=new School({
            name: req.body.name,
            owner:_pre,
            status:true,
            province:req.body.province,
            city:req.body.city,
            country:req.body.country,
            address:req.body.address,
            intro:req.body.intro
        });

        //id存在就是编辑 不存在就是新增
        if(id){
            School.update({_id:id},{
                name:schoolObj.name,
                owner:_pre,
                province:schoolObj.province,
                city:schoolObj.city,
                country:schoolObj.country,
                address:schoolObj.address,
                intro:schoolObj.intro
            },function(err,school){
                if(err){
                    console.log(err)
                }
                else{
                    res.redirect('/admin/school/list');
                }
            });
        }
        else{
            School.find({name:schoolObj.name},function(err,school){
                if(err){
                    console.log(err);
                }
                else{
                    if(school&&school.length>0){
                        res.redirect('/admin/school?err=exist');
                    }else{
                        schoolObj.save(function(err,school){
                            if(err){
                                console.log(err);
                            }
                            else{
                                res.redirect('/admin/school/list');
                            }
                        });
                    }
                }
            });
        }
    });


}
exports.del=function(req,res){

}
//中间件
exports.validSchoolId=function(req,res,next){
    var sid=req.query.sid;
    if(sid) {
        console.log('没有到达这里吗');
        if (!sid.match(/^[0-9a-fA-F]{24}$/)) {
            var err = new Error('参数错误');
            err.status = 404;
            err.message='错误的参数格式';
            next(err);
        }
    }
    next();
}