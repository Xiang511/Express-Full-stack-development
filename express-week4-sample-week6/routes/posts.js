var express = require('express');
var router = express.Router();
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");
const Post = require("../models/postsModel");
const User = require("../models/usersModel");
const {isAuth,generateSendJWT} = require('../service/auth');
router.get('/', async function(req, res, next) {
  const timeSort = req.query.timeSort == "asc" ? "createdAt":"-createdAt"
  const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
  const posts = await Post.find(q).populate({
      path: 'user',
      select: 'name photo '
    }).sort(timeSort);
  // res.send('respond with a resource');
  // res.status(200).json({
  //   post
  // })
  res.render('posts', { posts }); 
});
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Retrieve a list of posts
 *     description: Retrieve a list of posts with optional query parameters for sorting and searching.
 *     parameters:
 *       - in: query
 *         name: timeSort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort posts by creation time.
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search posts by content.
 *     responses:
 *       200:
 *         description: A list of posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *   post:
 *     summary: Create a new post
 *     description: Create a new post. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the post.
 *                 example: "This is a new post."
 *     responses:
 *       200:
 *         description: The created post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
