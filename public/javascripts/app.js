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
