const express = require('express');
const bcrypt = require('bcryptjs'); //
const appError = require('../service/appError'); 
const jwt = require('jsonwebtoken'); // 引入 jsonwebtoken
const handleErrorAsync = require('../service/handleErrorAsync');
const validator = require('validator'); // 引入 validator
const User = require('../models/usersModel');
const {isAuth,generateSendJWT} = require('../service/auth');
const router = express.Router();

router.get('/sign_in', (req, res) => {
  res.render('sign_in');
});

router.post('/sign_in',handleErrorAsync(async(req,res,next)=>{
  const { email, password } = req.body;
  if (!email || !password) {
    return next(appError( 400,'帳號密碼不可為空',next));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(appError(400, '帳號或密碼錯誤', next));
  }
  const auth = await bcrypt.compare(password, user.password);
  if(!auth){
    return next(appError(400,'您的密碼不正確',next));
  }
  const token = generateSendJWT(user); // 生成 JWT
  res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // 設置 cookie
  res.redirect('/posts'); // 成功登入後重定向到 posts 頁面
  // res.status(200).send('您已成功登入'); // 回復您已登入
  
}))

router.get('/sign_up', (req, res) => {
  res.render('sign_up');
});
router.post('/sign_up', handleErrorAsync(async(req, res, next) =>{
  let { email, password,confirmPassword,name } = req.body;
  // 內容不可為空
  if(!email||!password||!confirmPassword||!name){
    return next(appError("400","欄位未填寫正確！",next));
  }
  // 密碼正確
  if(password!==confirmPassword){
    return next(appError("400","密碼不一致！",next));
  }
  // 密碼 8 碼以上
  if(!validator.isLength(password,{min:8})){
    return next(appError("400","密碼字數低於 8 碼",next));
  }
  // 是否為 Email
  if(!validator.isEmail(email)){
    return next(appError("400","Email 格式不正確",next));
  }
  
  // 加密密碼
  password = await bcrypt.hash(req.body.password,12);
  const newUser = await User.create({
    email,
    password,
    name
  });
  generateSendJWT(newUser,201,res);  //res 會被傳到 generateSendJWT
  res.redirect('/posts'); // 成功登入後重定向到 posts 頁面
  // res.status(200).send('您已成功註冊'); // 回復您已登入
}))
















module.exports = router;