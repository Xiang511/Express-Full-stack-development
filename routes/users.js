const express = require('express');
const bcrypt = require('bcryptjs');
const appError = require('../service/appError');
const jwt = require('jsonwebtoken');
const handleErrorAsync = require('../service/handleErrorAsync');
const validator = require('validator');
const User = require('../models/usersModel');
const Post = require('../models/postsModel');
const Comment = require('../models/commentsModel');
const moment = require('moment');
const { isAuth, generateSendJWT } = require('../service/auth');
const router = express.Router();

router.get('/sign_in', (req, res) => {
  res.render('sign_in', { messages: req.flash() });
});

router.post('/sign_in', handleErrorAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', '帳號密碼不可為空');
    return res.redirect('/');
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    req.flash('error', '帳號或密碼錯誤');
    return res.redirect('/');
  }
  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    req.flash('error', '您的密碼不正確');
    return res.redirect('/');
  }
  const token = generateSendJWT(user); // 生成 JWT
  res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // 設置 cookie
  return res.redirect('/posts'); // 成功登入後重定向到 posts 頁面
}));

router.get('/sign_up', (req, res) => {
  res.render('sign_up', { messages: req.flash() });
});

router.post('/sign_up', handleErrorAsync(async (req, res, next) => {
  let { email, password, confirmPassword, name } = req.body;
  // 內容不可為空
  if (!email || !password || !confirmPassword || !name) {
    req.flash('error', '您填寫的欄位不正確');
    return res.redirect('/users/sign_up');
  }
  // 密碼正確
  if (password !== confirmPassword) {
    req.flash('error', '您的密碼並不一致');
    return res.redirect('/users/sign_up');
  }
  // 密碼 8 碼以上
  if (!validator.isLength(password, { min: 8 })) {
    req.flash('error', '您的密碼不足 8 碼');
    return res.redirect('/users/sign_up');
  }
  // 是否為 Email
  if (!validator.isEmail(email)) {
    req.flash('error', '您的Email格式不正確');
    return res.redirect('/users/sign_up');
  }

  // 加密密碼
  password = await bcrypt.hash(req.body.password, 12);
  const newUser = await User.create({
    email,
    password,
    name
  });
  generateSendJWT(newUser, 201, res); // res 會被傳到 generateSendJWT
  setTimeout(() => {
    res.redirect('/');
  }, 3000);
}));

router.get('/profile/', isAuth, handleErrorAsync(async (req, res, next) => {
  res.render('profile', { user: req.user });
}));

router.post('/updatePassword', isAuth, handleErrorAsync(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return next(appError("400", "密碼不一致！", next));
  }
  const newPassword = await bcrypt.hash(password, 12);
  const user = await User.findByIdAndUpdate(req.user.id, {
    password: newPassword
  });
  generateSendJWT(user, 200, res);
  res.status(200).send('您已成功變更密碼');
}));

// 獲取自己的貼文
router.get('/myPosts', isAuth, handleErrorAsync(async (req, res, next) => {
  try {
    const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";
    const posts = await Post.find({ user: req.user.id }).populate({
      path: 'user',
      select: 'name photo'
    }).sort(timeSort);

    // 格式化日期
    posts.forEach(post => {
      post.formattedDate = moment(post.createdAt).format('YYYY-MM-DD');
    });

    // 獲取所有評論
    const comments = await Comment.find().populate('user');

    res.render('my-posts', { posts, comments, user: req.user });
  } catch (err) {
    next(err);
  }
}));

module.exports = router;