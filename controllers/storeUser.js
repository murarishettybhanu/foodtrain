const User = require('../database/models/User')

module.exports = (req, res) => {
  User.create(req.body, (error, user) => {
    if (error) {
      req.flash('signup_failed', 'Account already exists')
      return res.redirect('/auth/register')
    }
    req.flash('signup_successfully', 'Registered successfully')
    res.redirect('/auth/login')
  })
}
