/**
 * Created by Administrator on 2016/6/21.
 */
var fs=require('fs');
var path=require('path');
exports.uploadify=function(req,res){
    var posterData=req.files['Filedata'];
    var filepath=posterData.path;
    var originalFilename=posterData.originalFilename;
    if(originalFilename){
        fs.readFile(filepath,function(err,data){
            var timertamp=Date.now();
            var names=posterData.name.split('.');
            var type=names[names.length-1];
            var poster=timertamp+'.'+type;
            var newPath=path.join(__dirname,'../../','upload/'+poster);
            console.log(newPath);
            fs.writeFile(newPath,data,function(err){
                if(err){
                    return res.send('error');
                }
                req.poster=poster;
                res.json({path:poster});
            });
        });
    }
    else{
        res.send('Invalid file type');
    }
}