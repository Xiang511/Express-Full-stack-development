const jwt = require('jsonwebtoken');
const appError = require('../service/appError'); 
const handleErrorAsync = require('../service/handleErrorAsync');
const express = require('express');
const User = require('../models/usersModel');
const isAuth = handleErrorAsync(async (req, res, next) => {
    // 確認 token 是否存在
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
  
    if (!token) {
      return next(appError(401,'你尚未登入！',next));
    }
  
    // 驗證 token 正確性
    const decoded = await new Promise((resolve,reject)=>{
      jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{
        if(err){
          reject(err)
        }else{
          resolve(payload) // payload 是解碼後的資料 取出 id
        }
      })
    })
    const currentUser = await User.findById(decoded.id); ///moogoose 的方法
  
    req.user = currentUser; // 把 user 放到 req 裡面
    next();
  });
const generateSendJWT= (user,statusCode,res)=>{
    // 產生 JWT token
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{     //payload user._id   process.env.JWT_SECRET 混淆保證安全性  
      expiresIn: process.env.JWT_EXPIRES_DAY   // 過期時間
    });
    user.password = undefined;
    // res.status(statusCode).json({
    //   status: 'success',
    //   user:{
    //     token,
    //     name: user.name
    //   }
    // });
    return token;
  }

module.exports = {
    isAuth,
    generateSendJWT
}