var express = require('express');
var router = express.Router();
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");
const Post = require("../models/postsModel");
const User = require("../models/usersModel");
const {isAuth,generateSendJWT} = require('../service/auth');
router.get('/', isAuth, async function(req, res, next) {
  const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";
  const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {};
  const posts = await Post.find(q).populate({
    path: 'user',
    select: 'name photo'
  }).sort(timeSort);
  res.render('posts', { posts, user: req.user }); // 傳遞 user 變數
});
router.get('/logout', (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 }); // 清除 cookie
  res.redirect('../users/sign_in'); // 重定向到登入頁面
});
router.post('/',isAuth, handleErrorAsync(async function(req, res, next) {
  const { content } = req.body;
  if(content == undefined){
    return next(appError(400,"你沒有填寫 content 資料",next))
  }
  const newPost = await Post.create({
    user: req.user.id,
    content
  });
  res.status(200).json({
    status:"success",
    post: newPost
  })
}));

module.exports = router;
