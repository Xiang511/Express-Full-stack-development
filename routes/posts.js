var express = require('express');
var router = express.Router();
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");
const Post = require("../models/postsModel");
const User = require("../models/usersModel");
const Comment = require('../models/commentsModel');
const { isAuth, generateSendJWT } = require('../service/auth');
const moment = require('moment');
// router.get('/', isAuth, async function(req, res, next) {
//   const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";
//   const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {};
//   const posts = await Post.find(q).populate({
//     path: 'user',
//     select: 'name photo'
//   }).sort(timeSort);
//   res.render('posts', { posts, user: req.user }); // 傳遞 user 變數
// });
router.get('/logout', (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 }); // 清除 cookie
  res.redirect('../users/sign_in'); // 重定向到登入頁面
});
router.post('/', isAuth, handleErrorAsync(async function (req, res, next) {
  const { content } = req.body;
  if (content == undefined) {
    return next(appError(400, "你沒有填寫 content 資料", next))
  }
  const newPost = await Post.create({
    user: req.user.id,
    content
  });
  res.status(200).json({
    status: "success",
    post: newPost
  })
}));
// 獲取所有貼文
router.get('/', isAuth, async (req, res, next) => {
  try {
    const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";
    const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {};
    const posts = await Post.find(q).populate({
      path: 'user',
      select: 'name photo'
    }).sort(timeSort);
    
  // 格式化日期
  posts.forEach(post => {
    post.formattedDate = moment(post.createdAt).format('YYYY-MM-DD');
  });
    // 獲取所有評論
    const comments = await Comment.find().populate('user');

    res.render('posts', { posts, comments, user: req.user });
  } catch (err) {
    next(err);
  }
});

//獲取自己的貼文
router.get('/myPosts', isAuth, async (req, res, next) => {
  try {
    const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";
    const posts = await Post.find({ user: req.user.id }).populate({ path: 'user',
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
});




// 獲取單個貼文以及其留言
router.get('/:id/', handleErrorAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate({
    path: 'user',
    select: 'name photo'
  });
  if (!post) {
    return next(appError(404, "找不到該貼文", next));
  }
   
  post.formattedDate = moment(post.createdAt).format('YYYY-MM-DD');
  
    
    // 獲取該貼文的所有留言
    const comments = await Comment.find({ post: req.params.id }).populate('user');

    comments.forEach(comment => {
      comment.formattedDate = moment(comment.createdAt).format('YYYY-MM-DD');
    });

    // 獲取貼文者的頭像
    const postUser = await User.findById(post.user._id)
  
    res.render('single-posts', { post, comments, user: req.user, postUser }); // 傳遞 user 變數
  }));


router.post('/:id/comment', isAuth, handleErrorAsync(async (req, res, next) => {
  const user = req.user.id;
  const post = req.params.id;
  const { comment } = req.body;
  const newComment = await Comment.create({
    post,
    user,
    comment
  });
  res.status(200).json({
    status: "success",
    comment: newComment
  })

}))




module.exports = router;
