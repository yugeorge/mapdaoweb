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
    res.render('edit',{ message:'you are yourself'});
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
   var fileUploadControl = $("#exampleInputFileA")[0];
if (fileUploadControl.files.length > 0) {
  var file = fileUploadControl.files[0];
  var name = "photo.jpg";
  var avFile = new AV.File(name, file);
}
  avFile.save().then(function() {
  // The file has been saved to AV.
}, function(error) {
  // The file either could not be read, or could not be saved to AV.
});




});






// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();