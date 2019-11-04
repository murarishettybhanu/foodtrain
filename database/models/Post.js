const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  name: String,
  date: String,
  email: String,
  time: String,
  quantity: String,
  message: String,
  otp:String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

const Post = mongoose.model('Post', PostSchema)

module.exports = Post
