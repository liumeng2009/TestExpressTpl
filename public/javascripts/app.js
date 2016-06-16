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
var checkGradeUser=function(){
    var container=$('#hfdGradeUsers').parents('.form-group');
    var users=$('#hfdGradeUsers').val();
    var select=container.find('#selectGradeUsers');
    var userArray=users.split(',');
    //删除数组里面的空值
    for(var n=0;n<userArray.length;n++){
        if(userArray[n].toString().trim()===""){
            userArray.splice(n,1);
            i=i-1;
        }
    }


    for(var i=0;i<userArray.length;i++){
        var selectText='';
        for(var m=0;m<select.children().length;m++){
            if(userArray[i]===select.children().eq(m).val()){
                selectText=select.children().eq(m).text();
                break;
            }
        }
        //增加标签
        var tag=$('<span>').addClass('tag');
        var span=$('<span>').html(selectText+'&nbsp;&nbsp;')
        var a=$('<a>').addClass('Removing').addClass('tag').text('x');
        a.click(function(e){
            //删除tag
            var tag=$(this).parents('.tag');
            tag.remove();
            //删除控件
            $('#hfdGradeUsers').val($('#hfdGradeUsers').val().replace(a.attr('data'),''));
        });
        a.attr('data',userArray[i]);
        tag.append(span).append(a);
        container.find('.tagsinput').append(tag);
    }
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
                            url: '/admin/list?id=' + id
                        })
                        .done(function (results) {
                            if (results.success === 1) {
                                if (tr.length > 0) {
                                    tr.remove();
                                }
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
    $('#addGradeUsers').click(function(e){
        var container=$(this).parents('.form-group');
        var submit=container.find('#hfdGradeUsers');
        var select=container.find('#selectGradeUsers');
        var selectVal=select.val();
        var selectText='';
        for(var i=0;i<select.children().length;i++){
            if(select.children().eq(i).val()===select.val()){
                selectText=select.children().eq(i).text();
                break;
            }
        }
        var submitVal=submit.val();
        if(submitVal.indexOf(selectVal)>-1){
            //说明存在
        }
        else{
            //增加标签
            var tag=$('<span>').addClass('tag');
            var span=$('<span>').html(selectText+'&nbsp;&nbsp;')
            var a=$('<a>').addClass('Removing').addClass('tag').text('x');
            a.click(function(e){
                //删除tag
                var tag=$(this).parents('.tag');
                tag.remove();
                //删除控件
                submit.val(submit.val().replace(a.attr('data'),''));
            });
            a.attr('data',selectVal);
            tag.append(span).append(a);
            container.find('.tagsinput').append(tag);

            //存入控件
            submit.val(submitVal+','+selectVal);
        }
    });
    $('#schools').change(function(){
        var sid=$(this).val();
        alert('学校id是'+sid);
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
    });
});
