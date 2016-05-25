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
