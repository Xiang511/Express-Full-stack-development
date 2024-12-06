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
  const auth = await bcrypt.compare(password, user.password);
  if(!auth){
    return next(appError(400,'您的密碼不正確',next));
  }
  const token = generateSendJWT(user); // 生成 JWT
  res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // 設置 cookie
  // res.redirect('/posts'); // 成功登入後重定向到 posts 頁面
  res.status(200).send('您已成功登入'); // 回復您已登入
  
}))

module.exports = router;