var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');


var indexRouter = require('./routes/index');
var aboutRouter = require('./routes/about');
var gbookRouter = require('./routes/gbook');
var infoRouter = require('./routes/info');
var shareRouter = require('./routes/share');
var loginRouter = require('./routes/login');

var articleControl = require('./control/article');
var noticeControl = require('./control/notice');
var commentControl = require('./control/comment');
var myselfinfoControl = require('./control/myselfinfo');
var pictureControl = require('./control/picture');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
//------------------------------------------------------------
app.use(session({
  secret :  ['aa','bb','cc'], // 对session id 相关的cookie 进行签名，可以是一个数组
  resave: true, //强制session保存到session store中。即使在请求中这个session没有被修改
  saveUninitialized: true, // 是否保存未初始化的会话，即使没有用req.session
  cookie: {
      maxAge: 1000 * 60 * 30, // 设置 session 的有效时间，单位毫秒
  },
  rolling: true //每次请求都重置过期时间
}));
//验证是否登录
var excludeUrls = new RegExp('/users/'); //不需要登录的url
//这里要进行拦截过滤,有些页面必须登录才能访问

app.use(function(req, res , next){
    if(excludeUrls.test(req.url)){
      if(req.session.username){//如果有登录，直接放过
        next();
      }else{//如果没有登录，重定向到登录
        res.render('msg', {
          msg: '您还没登录!',
          nextPageName: '登录页',
          nextPageUrl: '/login',
          tips:'danger'
        });
      }
    }else{
      next();
    }
});
// /主页路由
app.use('/index', indexRouter);
//关于我
app.use('/about', aboutRouter);
//留言
app.use('/gbook', gbookRouter);
//慢生活
app.use('/info', infoRouter);
//模版分享
app.use('/share', shareRouter);
// 登录
app.use('/login', loginRouter);


//后台---------------------------------
//个人中心
app.use('/users/myselfinfo',myselfinfoControl);
//文章
app.use('/users/article',articleControl);
//公告
app.use('/users/notice',noticeControl);
//评论
app.use('/users/comment',commentControl);
//图片管理
app.use('/users/picture',pictureControl);

app.use('/', indexRouter);


//------------------------------------------------------------
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.error(err)
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
