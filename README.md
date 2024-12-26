## Express-Full-stack-development

 開發一個類似IG貼文系統，具備登入、新增貼文、按讚、追蹤 ....等功能
 
 使用 ```Express.js``` + ```MongoDB``` 開發並部屬於```Render```伺服器上

> [!NOTE]
> 目前使用```Render```部屬免費方案,所以暫時不開放訪問(有流量限制)

## Demo (beta)



![image](https://github.com/user-attachments/assets/a756afc1-015f-44d6-9b05-da362460a93c)

![image](https://github.com/user-attachments/assets/cf1b906b-0db1-47d6-aac6-7aa8852dca1b)


##

**會員功能**

- [x] 1. [POST][註冊會員]：`{url}/user/sign_up`

- [x] 2. [POST][登入會員]：`{url}/users/sign_in`

- [x] 3. [PATCH][重設密碼]：`{url}/users/updatePassword`

- [x] 4. [GET][取得個人資料]：`{url}/users/profile`

- [x] 5. [PATCH][更新個人資料]：`{url}/users/profile`

**動態貼文**

- [x] 1. [GET][取得所有貼文]：`{url}/posts`

- [x] 2. [GET][取得單一貼文]：`{url}/posts/{postID}`

- [x] 3. [POST][新增貼文]：`{url}/posts`

- [ ] 4. [POST][新增一則貼文的讚]：`{url}/posts/{postID}/like`

- [ ] 5. [DELETE][取消一則貼文的讚]：`{url}/posts/{postID}/unlike`

- [x] 6. [POST][新增一則貼文的留言]：`{url}/posts/{postID}/comment`
- [x] 7. [GET][取得個人所有貼文列表]：`{url}/post/user/{userID}`

**追蹤動態**

- [ ] 1. [POST][追蹤朋友]：`{url}/users/{userID}/follow`

- [ ] 2. [DELETE][取消追蹤朋友]：`{url}/users/{userID}/unfollow`

- [ ] 3. [GET][取得個人按讚列表]：`{url}/users/getLikeList`

- [ ] 4. [GET][取得個人追蹤名單]：`{url}/users/following`



**其他**

### 範例登入

```
{
    "email":"xinag12345@gmail.com",
    "password":"xiang123456"
}
```

### 範例註冊
```
{
    "name":"xiang5",
    "email":"xinag12345@gmail.com",
    "confirmPassword":"xiang123",
    "password":"xiang123"
   
}
```
### 更新密碼
> [!TIP]
> 要先進行登入驗證 -> Cookies -> JWT 

postman 右側查看程式碼取得 ```Token```

```
{
    "password":"xiang1234",
    "confirmPassword":"xiang1234"    
}
```

### 新增貼文

> [!TIP]
> 要先進行登入驗證 -> Cookies -> JWT 

```
{
    "content":"hi 大家 11/30"
}
```

### 上傳照片

![alt text](image-upload.png)

### Swagger

```
/api-docs/
```
![alt text](image-swagger.png)
