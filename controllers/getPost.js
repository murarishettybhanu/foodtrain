const Post = require('../database/models/Post')
const User = require('../database/models/User')

module.exports = async (req, res) => {
  const users = await User.findOne({_id:req.session.userId});
  const posts = await Post.find({}).sort({createdAt:-1}).populate('author');
  res.render("post", {
    posts,users
  });
}