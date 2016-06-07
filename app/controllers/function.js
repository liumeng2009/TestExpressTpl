/**
 * Created by Administrator on 2016/6/7.
 */
var FunctionModel=require('../models/function');
var _=require('underscore');

exports.function_list=function(req,res){
    FunctionModel.fetch(function(err,functions){
        if(err){
            console.log(err);
        }
        else{
            res.render('./pages/function/function_list',{
                title:'网站功能列表',
                functions:functions
            });
        }
    });
};
exports.function=function(req,res){
    var id=req.query.id;
    FunctionModel.findById({_id:id},function(err,functionobj){
        console.log('参数是:'+functionobj);
        if(functionobj){
            res.render('./pages/function/function_edit',{
                title:'编辑管理员',
                function_obj:functionobj,
                action:'编辑'
            });
        }
        else{
            res.render('./pages/function/function',{
                title:'新增管理员',
                function_obj:[],
                action:'新增'
            });
        }
    });
};

exports.new=function(req,res){
    var id=req.body._id;
    var functionObj={
        name:req.body.name,
        index:req.body.index,
        status:true,
        actions:{
            show:req.body.chkShow?true:false,
            edit:req.body.chkEdit?true:false,
            delete:req.body.chkDelete?true:false,
            create:req.body.chkCreate?true:false,
            confirm:req.body.chkConfirm?true:false
        }
    };

    console.log('到这里了吗？'+functionObj);

    if(id){
        FunctionModel.findById({_id:id},function(err,hasF){
            if(err)
                return console.log(err);
            delete functionObj.index;
            var _function= _.extend(hasF,functionObj);
            _function.save(function(err,func){
                if(err)
                    return console.log(err)
                res.redirect('/admin/function/list');
            });
        });
    }
    else{
        FunctionModel.find({name:functionObj.name},function(err,functionobj){
            if(err)
                return console.log(err);
            if(functionobj&&functionobj.length>0){
                res.redirect('/admin/function?err=exist');
            }
            else{
                FunctionModel.find({index:functionobj.index},function(err,functionobj){
                    if(err)
                        return console.log(err);
                    if(functionobj&&functionobj.length>0){
                        res.redirect('/admin/function?err=exist');
                    }
                    else{
                        var _function=new FunctionModel(functionObj);

                        console.log('保存前：'+_function);

                        _function.save(function(err,functionobj){
                            if(err)
                                return console.log(err);
                            res.redirect('/admin/function/list');
                        });
                    }
                });
            }
        });
    }
}