/**
 * Created by Administrator on 2016/7/15.
 */
var Student=require('../../models/student');
var Grade=require('../../models/grade');
var School=require('../../models/school');
var User=require('../../models/user')
var config=require('../../../config');
var mongoose=require('mongoose');
var deepPopulate=require('mongoose-deep-populate')(mongoose);
var UserSchema=require('../../schemas/user');
UserSchema.plugin(deepPopulate,{});
var _=require('underscore');

exports.new=function(req,res){
    console.log('new'+req.app.locals.user);
    var user=req.app.locals.user;
    var id=req.body.id;
    var sid=req.body.school;
    var gid=req.body.grade;
    var pid=user._id;
    School.findOne({status:true,_id:sid})
        .populate('roles')
        .exec(function(err,school){
            if(err){
                res.json({success:0,msg:config.msg.db});
                return console.log(err);
            }
            if(school){
                console.log(school);
                Grade.findOne({status:true,_id:gid},function(err,grade){
                    if(err){
                        res.json({success:0,msg:config.msg.db});
                        return console.log(err);
                    }
                    User.findOne({status:true,_id:pid},function(err,parent){
                        if(err){
                            res.json({success:0,msg:config.msg.db});
                            return console.log(err);
                        }
                        var studentObj={
                            name:req.body.name,
                            school:school,
                            grade:grade,
                            parent:parent,
                            sex:req.body.sex,
                            age:req.body.age,
                            health:req.body.health,
                            interest:req.body.interest,
                            state_now:req.body.state_now,
                            school_remark:req.body.school_remark,
                            status:true,
                            image:req.body.image
                        };
                        if(id){
                            Student.findById({status:true,_id:id},function(err,student){
                                if(err) {
                                    res.json({success:0,msg:config.msg.db});
                                    return console.log(err);
                                }
                                if(student){
                                    var _student= _.extend(student,studentObj);
                                    _student.save(function(err,student){
                                        if(err){
                                            res.json({success:0,msg:config.msg.db});
                                            return console.log(err);
                                        }
                                        //将student存入parent表
                                        if(parent.sons) {
                                        }
                                        else{
                                            parent.sons=[];
                                        }
                                        //是否存在
                                        if(parent.sons.toString().indexOf(student._id.toString())>-1){

                                        }
                                        else {
                                            parent.sons.push(student);
                                        }
                                        parent.save(function(err,parent){
                                            if(err){
                                                res.json({success:0,msg:config.msg.db});
                                                return console.log(err);
                                            }
                                            //将student存入grade表
                                            if(grade.students){
                                            }
                                            else{
                                                grade.students=[];
                                            }
                                            if(grade.students.toString().indexOf(student._id.toString())>-1){

                                            }
                                            else{
                                                grade.students.push(student);
                                            }

                                            grade.save(function(err,parent){
                                                if(err){
                                                    res.json({success:0,msg:config.msg.db});
                                                    return console.log(err);
                                                }
                                                res.json({success:1,msg:config.msg.success})
                                            });
                                        });
                                    });
                                }
                                else{
                                    res.json({success:0,msg:config.msg.notexists})
                                }
                            })
                        }
                        else{
                            console.log('add');
                            var _student=new Student(studentObj);
                            _student.save(function(err,student){
                                if(err){
                                    res.json({success:0,msg:config.msg.db});
                                    return console.log(err);
                                }
                                //将student存入parent表
                                if(parent.sons) {
                                }
                                else{
                                    parent.sons=[];
                                }
                                parent.sons.push(student);
                                //parent需要增加role
                                var roleObj={

                                }
                                for(var i=0;i<school.roles.length;i++){
                                    if(school.roles[i].name==='家长'){
                                        roleObj.role=mongoose.Types.ObjectId(school.roles[i]._id);
                                        roleObj.grade=grade;
                                    }
                                }
                                parent.roles.push(roleObj);
                                console.log('update parent'+parent);
                                parent.save(function(err,parent){
                                    if(err){
                                        res.json({success:0,msg:config.msg.db});
                                        return console.log(err);
                                    }
                                    //将student存入grade表
                                    if(grade.students){
                                    }
                                    else{
                                        grade.students=[];
                                    }
                                    grade.students.push(student);
                                    grade.users.push(parent);
                                    grade.save(function(err,parent){
                                        if(err){
                                            res.json({success:0,msg:config.msg.db});
                                            return console.log(err);
                                        }
                                        res.json({success:1,msg:config.msg.success})
                                    });
                                })

                            });
                        }
                    });
                });
            }
            else{
                res.json({success:0,msg:config.msg.notexists})
            }
        })

}

exports.list=function(req,res){
    var user=req.app.locals.user;
    var SearchObj=[];
    for(var i=0;i<user.sons.length;i++){
        var _s={_id:user.sons[i].toString()};
        SearchObj.push(_s);
    }
    Student.find({status:true})
        .or(SearchObj)
        .populate('grade')
        .exec(function(err,students){
            if(err){
                res.json({success:0,msg:config.msg.db});
                return console.log(err);
            }
            res.json({success:1,students:students});
        });
}

exports.chat_list=function(req,res){
    var studentid=req.query.id;
    Student.findOne({status:true,_id:studentid})
        .exec(function(err,student){
            if(err){
                res.json({success:0,msg:config.msg.db});
                return console.log(err);
            }
            var gradeid=student.grade.toString();
            Grade.findOne({status:true,_id:gradeid})
                .exec(function(err,grade){
                    if(err){
                        res.json({success:0,msg:config.msg.db});
                        return console.log(err);
                    }
                    var SearchObj=[];
                    for(var i=0;i<grade.users.length;i++){
                        var _s={_id:grade.users[i].toString()}
                        SearchObj.push(_s);
                    }
                    User.find({status:true})
                        .or(SearchObj)
                        .populate('sons')
                        .deepPopulate(['roles.grade','roles.role'])
                        .exec(function(err,users){
                            if(err){
                                res.json({success:0,msg:config.msg.db});
                                return console.log(err);
                            }
                            console.log(users);
                            for(var m=0;m<users.length;m++){
                                //处理一下user的role 和这个班级无关的role删除
                                for(var i=0;i<users[m].roles.length;i++){
                                    console.log(users[m].roles[i].grade._id.toString());
                                    console.log(grade._id);
                                    if(users[m].roles[i].grade._id.toString()===grade._id.toString()){

                                    }
                                    else{
                                        users[m].roles.splice(i,1);
                                        i--;
                                    }
                                }
                                //处理一下user的sons，和这个班级无关的son被删掉
                                for(var j=0;j<users[m].sons.length;j++){
                                    console.log(users[m].sons[j].grade.toString());
                                    console.log(grade._id);
                                    if(users[m].sons[j].grade.toString()===grade._id.toString()){

                                    }
                                    else{
                                        users[m].sons.splice(j,1);
                                        j--;
                                    }
                                }


                            }



                            console.log(users);
                            res.json({success:1,msg:config.msg.success,users:users});
                        });
                });
        });
}