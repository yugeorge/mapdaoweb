// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();
var fs = require('fs');




// App 全局配置
app.set('views','cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(express.bodyParser());    // 读取请求 body 的中间件

//app.use(express.cookieParser('Your Cookie Secure'));
//使用avos-express-cookie-session记录登录信息到cookie。
//app.use(avosExpressCookieSession({ cookie: { maxAge: 3600000 }}));

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});

app.get('/',function(req, res){
   res.render('index',{ message:''});
});

app.get('/register',function(req, res){
   res.render('register',{ message:''});
});

app.post('/register',function(req, res){
   var user=new AV.User();
   user.set("username",req.body.username);
   user.set("password",req.body.password);
   user.set("email", req.body.usermail);
   user.signUp(null, {
  success: function(user) {
    res.redirect('/');
  },
  error: function(user, error) {
    // Show the error message somewhere and let the user try again.
    res.render('register',{ message:error.message});
}}
);
});

app.get('/edit',function(req, res){
    res.render('edit',{ message:''});
});

app.post('/', function(req, res) {
    AV.User.logIn(req.body.username, req.body.password).then(function() {
      //登录成功，avosExpressCookieSession会自动将登录用户信息存储到cookie
      //跳转到profile页面。
      
	  console.log('signin successfully: %j', AV.User.current());
      res.redirect('/edit');
    },function(error) {
      //登录失败，跳转到登录页面
      res.render('index',{ message:'登录失败，请重新登录'});
	  
  });
});

app.post('/edit',function(req,res){
 var File_a = req.files.example;
 var File_b = req.files.exampleB;
 var File_c = req.files.exampleC;
 var File_d = req.files.exampleD;
 var File_e = req.files.exampleE;
 var Point = AV.Object.extend("UserPoint");
 var point = new Point();
 var usr;
 usr = AV.User.current();

 
 point.set("name",req.body.pointname);
 point.set("Introduction", req.body.introduction);
 point.set("routename",req.body.routename);
 point.set("routenum",req.body.routenumber);
 point.set("Editor",usr);

 var data=fs.readFileSync(File_a.path);
 
 //fs.readFile(File_a.path, function(err, data){
      //if(err)
      //  return res.send("读取文件失败");
      var base64Data = data.toString('base64');
      var theFile = new AV.File(File_a.name, {base64: base64Data});
	  theFile.save();
	 
	 
	 
	
	  
    
  
	point.set("GraphicA",theFile);
	 	
  if(File_b){
    fs.readFile(File_b.path, function(err, data){
      if(err)
        return res.send("读取文件失败");
      var base64Data = data.toString('base64');
      theFileb = new AV.File(File_b.name, {base64: base64Data});
      theFileb.save().then(function(theFileb){
        //res.send("上传成功！");
      });
    });
  }else
    res.send("请选择一个文件。");	
	point.set("GraphicB",theFileb);
	  if(File_c){
    fs.readFile(File_c.path, function(err, data){
      if(err)
        return res.send("读取文件失败");
      var base64Data = data.toString('base64');
      theFilec = new AV.File(File_c.name, {base64: base64Data});
      theFilec.save().then(function(theFilec){
      
      });
    });
  }else
    res.send("请选择一个文件。");
	
	  if(File_d){
    fs.readFile(File_d.path, function(err, data){
      if(err)
        return res.send("读取文件失败");
      var base64Data = data.toString('base64');
      theFiled = new AV.File(File_d.name, {base64: base64Data});
      theFiled.save().then(function(theFiled){
       // res.send("上传成功！");
      });
    });
  }else
    res.send("请选择一个文件。");
	
		  if(File_e){
    fs.readFile(File_e.path, function(err, data){
      if(err)
        return res.send("读取文件失败");
      var base64Data = data.toString('base64');
      theFilee = new AV.File(File_e.name, {base64: base64Data});
      theFilee.save().then(function(theFilee){
       // res.send("上传成功！");
      });
    });
  }else
    res.send("请选择一个文件。");
 //file.save();
 //point.set("Graphic",theFile);
 
 
 point.set("GraphicC",theFilec);
 point.set("GraphicD",theFiled);
 point.set("GraphicE",theFilee);
 point.save(null, {
  success: function(point) {
    // Execute any logic that should take place after the object is saved.
    res.send('New object created with objectId: ' + point.id);
  },
  error: function(point, error) {
    // Execute any logic that should take place if the save fails.
    // error is a AV.Error with an error code and description.
    res.send('Failed to create new object, with error code: ' + error.description);
  }});


});






// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();