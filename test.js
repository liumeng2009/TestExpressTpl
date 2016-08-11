/**
 * Created by Administrator on 2016/6/2.
 */
var mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1:12345/dbIM');

var User=mongoose.model('User',{
    name:String
});

var Book=mongoose.model('Book',{
    name:String,
    author:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    }
});

var user=new User({
    name:'liumeng'
});

var book=new Book({
    name:'小李飞刀',
    author:user
});

user.save(function(err){
    if(err)
        return console.log(err);
    console.log('保存之前：'+book);
    book.save({},function(err){
        if(err)
            return console.log(err);
    });

    Book.findOne().populate('author').exec(function(err,book){
        console.log('after populate:',err,book);
    });

});

protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    webView=(WebView) findViewById(R.id.webview);
    textview=(TextView)findViewById(R.id.textview);
    //允许JavaScript执行
    webView.getSettings().setJavaScriptEnabled(true);
    //找到Html文件，也可以用网络上的文件
    webView.loadUrl("file:///android_asset/www/index.html");
    // 添加一个对象, 让JS可以访问该对象的方法, 该对象中可以调用JS中的方法
    webView.addJavascriptInterface(new Contact(), "contact");
}

public final class Contact {
    //JavaScript调用此方法拨打电话
@JavascriptInterface
    public void call() {
        Log.v("success","start a service");

    }
}