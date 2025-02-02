var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const postRouter = require('./routes/posts');
const uploadRouter = require('./routes/upload');
const session = require('express-session');
const flash = require('connect-flash');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/javascripts', express.static(path.join(__dirname, 'javascripts')));
app.set('view engine', 'ejs'); // 設置 EJS 為視圖引擎
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

process.on('uncaughtException', err => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error('Uncaughted Exception！')
  console.error(err);
  process.exit(1);
});


dotenv.config({ path: './test.env' });

// 設置 strictQuery 選項
mongoose.set('strictQuery', true);
const DB = process.env.DATABASE.replace('<db_password>', process.env.DATABASE_PASSWORD); //連接資料庫


// 連接資料庫
mongoose.connect(DB)
    .then(() => {
        console.log('資料庫連線成功')
    })
    .catch((error) => {
        console.log(error);
    });


// mongoose.connect('mongodb://localhost:27017/newTest')
//   .then(res => console.log("連線資料庫成功"));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postRouter);
app.use('/upload', uploadRouter)


// 404 錯誤
app.use(function (req, res, next) {
  res.status(404).json({
    status: 'error',
    message: "無此路由資訊",
  });
});

// express 錯誤處理
// 自己設定的 err 錯誤 
const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message
    });
  } else {
    // log 紀錄
    console.error('出現重大錯誤', err);
    // 送出罐頭預設訊息
    res.status(500).json({
      status: 'error',
      message: '系統錯誤，請恰系統管理員'
    });
  }
};
// 開發環境錯誤
const resErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    error: err,
    stack: err.stack
  });
};
// 錯誤處理
app.use(function (err, req, res, next) {
  // dev
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res);
  }
  // production
  if (err.name === 'ValidationError') {
    err.message = "資料欄位未填寫正確，請重新輸入！"
    err.isOperational = true;
    return resErrorProd(err, res)
  }
  resErrorProd(err, res)
});

// 未捕捉到的 catch 
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', err);
});

module.exports = app;
