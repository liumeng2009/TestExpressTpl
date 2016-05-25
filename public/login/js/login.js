/**
 * Created by liumeng on 2016/5/24.
 */
$('#login-button').click(function(event){
    event.preventDefault();
    $('form').fadeOut(500);
    $('.wrapper').addClass('form-success');
});