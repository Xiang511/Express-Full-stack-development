const mongoose = require('mongoose')
const postSchema = new mongoose.Schema(
    {
      content: {
        type: String,
        required: [true, 'Content 未填寫']
      },
      image: {
        type:String,
        default:""
      },
      createdAt: {
        type: Date,
        default: Date.now,
        // select: false 
      },
      user: {
          type: mongoose.Schema.ObjectId,
          ref:"user",
          required: [true, '貼文 ID 未填寫']
      },
      likes: [
        { 
          type: mongoose.Schema.ObjectId, 
          ref: 'User' 
        }
      ],
    },{
      versionKey: false,  
      toJSON: { virtuals: true },  //要使用要先宣告 virtual
      toObject: { virtuals: true }, //要使用要先宣告 virtual
    }
);

postSchema.virtual('comments', {  // 這邊是虛擬的 comments
  ref: 'Comment',  // 這邊是 comment 的 model
  foreignField: 'post', // 這邊是 comment 的 post
  localField: '_id' // 這邊是 post 的 _id
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;