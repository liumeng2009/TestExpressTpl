var checkSideNav=function(navName){
    var sideNav=$('#sideNav');
    sideNav.find('li').each(function(index){
        if($(this).text()==navName){
            var targetLi=$(this);
            if(targetLi.parents('li')){
                var parentLi=targetLi.parents('li').eq(0);
                parentLi.addClass('hasSub');
                parentLi.find('a').eq(0).addClass('expand');
                targetLi.parent('ul').addClass('show');
                targetLi.find('a').addClass('active');
            }
            else{
                targetLi.addClass('hasSub');
                targetLi.find('a').eq(0).addClass('expand');
            }
        }
    })
}

var checkRole=function(){
    var sid=$('#schools').val();
    $.ajax({
            type:'get',
            url:'/admin/role/findrole/'+sid,
            dataType:'json'
        })
        .done(function (results) {
            var roles=results;
            $('#roles').children().remove();
            for(var i=0;i<roles.length;i++){
                var _options=$('<option>').val(roles[i]._id).text(roles[i].name);
                $('#roles').append(_options);
            }
        }).fail(function(err) {
        alert(err);
    });
}


$(function(){
    $('#adminUserList .del').click(function(e){
        var target=$(e.target);
        var id=target.data('id');
        var tr=$('.item-id-'+id);
        bootbox.confirm({
            message:'确认删除吗',
            size:'small',
            callback:function (result) {
                if(result) {
                    $.ajax({
                            type: 'DELETE',
                            url: '/admin/admin/list?id=' + id
                        })
                        .done(function (results) {
                            if (results.success === 1) {
                                if (tr.length > 0) {
                                    tr.remove();
                                }
                            }
                            else{
                                bootbox.alert({
                                    title:'错误',
                                    message:results.info,
                                    callback:function(){}
                                });
                            }
                        }).fail(function(err){
                        bootbox.alert({
                            title:'错误',
                            message:err.statusText,
                            callback:function(){}
                        });
                    });
                }
            },
            buttons:{
                'confirm':{
                    label:'确定'
                },
                'cancel':{
                    label:'取消'
                }
            }


        });
    });
    $('#presidentList .del').click(function(e){
        var target=$(e.target);
        var id=target.data('id');
        var tr=$('.item-id-'+id);
        bootbox.confirm({
            message:'确认删除吗',
            size:'small',
            callback:function (result) {
                if(result) {
                    $.ajax({
                            type: 'DELETE',
                            url: '/admin/president/list?id=' + id
                        })
                        .done(function (results) {
                            if (results.success === 1) {
                                if (tr.length > 0) {
                                    tr.remove();
                                }
                            }
                            else{
                                bootbox.alert({
                                    title:'错误',
                                    message:results.info,
                                    callback:function(){}
                                });
                            }
                        }).fail(function(err){
                        bootbox.alert({
                            title:'错误',
                            message:err.statusText,
                            callback:function(){}
                        });
                    });
                }
            },
            buttons:{
                'confirm':{
                    label:'确定'
                },
                'cancel':{
                    label:'取消'
                }
            }


        });
    });
    $('#studentList .del').click(function(e){
        var target=$(e.target);
        var id=target.data('id');
        var tr=$('.item-id-'+id);
        bootbox.confirm({
            message:'确认删除吗',
            size:'small',
            callback:function (result) {
                if(result) {
                    $.ajax({
                            type: 'DELETE',
                            url: '/admin/student/list?id=' + id
                        })
                        .done(function (results) {
                            if (results.success === 1) {
                                if (tr.length > 0) {
                                    tr.remove();
                                }
                            }
                            else{
                                bootbox.alert({
                                    title:'错误',
                                    message:results.info,
                                    callback:function(){}
                                });
                            }
                        }).fail(function(err){
                            bootbox.alert({
                                title:'错误',
                                message:err.statusText,
                                callback:function(){}
                            });
                    });
                }
            },
            buttons:{
                'confirm':{
                    label:'确定'
                },
                'cancel':{
                    label:'取消'
                }
            }


        });
    });
    $('#roleList .del').click(function(e){
        var target=$(e.target);
        var id=target.data('id');
        var tr=$('.item-id-'+id);
        bootbox.confirm({
            message:'确认删除吗',
            size:'small',
            callback:function (result) {
                if(result) {
                    $.ajax({
                            type: 'DELETE',
                            url: '/admin/role/list?id=' + id
                        })
                        .done(function (results) {
                            if (results.success === 1) {
                                if (tr.length > 0) {
                                    tr.remove();
                                }
                            }
                            else{
                                bootbox.alert({
                                    title:'错误',
                                    message:results.info,
                                    callback:function(){}
                                });
                            }
                        }).fail(function(err){
                        bootbox.alert({
                            title:'错误',
                            message:err.statusText,
                            callback:function(){}
                        });
                    });
                }
            },
            buttons:{
                'confirm':{
                    label:'确定'
                },
                'cancel':{
                    label:'取消'
                }
            }


        });
    });
    $('#schoolList .del').click(function(e){
        var target=$(e.target);
        var id=target.data('id');
        var tr=$('.item-id-'+id);
        bootbox.confirm({
            message:'确认删除吗',
            size:'small',
            callback:function (result) {
                if(result) {
                    $.ajax({
                            type: 'DELETE',
                            url: '/admin/school/list?id=' + id
                        })
                        .done(function (results) {
                            if (results.success === 1) {
                                if (tr.length > 0) {
                                    tr.remove();
                                }
                            }
                            else{
                                bootbox.alert({
                                    title:'错误',
                                    message:results.info,
                                    callback:function(){}
                                });
                            }
                        }).fail(function(err){
                        bootbox.alert({
                            title:'错误',
                            message:err.statusText,
                            callback:function(){}
                        });
                    });
                }
            },
            buttons:{
                'confirm':{
                    label:'确定'
                },
                'cancel':{
                    label:'取消'
                }
            }


        });
    });
    $('#userList .del').click(function(e){
        var target=$(e.target);
        var id=target.data('id');
        var tr=$('.item-id-'+id);
        bootbox.confirm({
            message:'确认删除吗',
            size:'small',
            callback:function (result) {
                if(result) {
                    $.ajax({
                            type: 'DELETE',
                            url: '/admin/user/list?id=' + id
                        })
                        .done(function (results) {
                            if (results.success === 1) {
                                if (tr.length > 0) {
                                    tr.remove();
                                }
                            }
                            else{
                                bootbox.alert({
                                    title:'错误',
                                    message:results.info,
                                    callback:function(){}
                                });
                            }
                        }).fail(function(err){
                        bootbox.alert({
                            title:'错误',
                            message:err.statusText,
                            callback:function(){}
                        });
                    });
                }
            },
            buttons:{
                'confirm':{
                    label:'确定'
                },
                'cancel':{
                    label:'取消'
                }
            }


        });
    });
    $('#userRoles .del').click(function(e){
        var target=$(e.target);
        var id=target.data('id');
        var objid=target.attr('data-obj');
        var userid=target.attr('data');
        var gradeid=target.attr('data-grade');
        var tr=$('.item-id-'+objid);
        bootbox.confirm({
            message:'确认删除吗',
            size:'small',
            callback:function (result) {
                if(result) {
                    $.ajax({
                            type: 'DELETE',
                            url: '/admin/user/insert/role?id=' + id+'&userid='+userid+'&gradeid='+gradeid+'&objid='+objid
                        })
                        .done(function (results) {
                            if (results.success === 1) {
                                if (tr.length > 0) {
                                    tr.remove();
                                }
                            }
                            else{
                                bootbox.alert({
                                    title:'错误',
                                    message:results.info,
                                    callback:function(){}
                                });
                            }
                        }).fail(function(err){
                        bootbox.alert({
                            title:'错误',
                            message:err.statusText,
                            callback:function(){}
                        });
                    });
                }
            },
            buttons:{
                'confirm':{
                    label:'确定'
                },
                'cancel':{
                    label:'取消'
                }
            }


        });
    });
});
