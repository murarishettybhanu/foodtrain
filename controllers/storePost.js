const Post = require('../database/models/Post')
const User = require('../database/models/User')
var nodemailer = require('nodemailer');
var QRCode = require('qrcode')


module.exports = async (req, res) => {
  var otp = "TFT-T-" + Math.floor(Math.random() * (99999 - 100) + 100);
  const user = await User.findOne({ _id: req.session.userId });
  const email = user.email;
  console.log(email);

  QRCode.toFile('./public/otps/'+otp+'.png', otp, {
    color: {
      dark: '#000000',  // Blue dots
      light: '#0000' // Transparent background
    }
  }, function (err) {
    if (err) throw err
    console.log('done')
  })
  

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'adithyakondra007@gmail.com ',
      pass: 'aditya@007'
    }
  });

  var mailOptions = {
    from: 'adithyakondra007@gmail.com ',
    to: email,
    subject: 'Table Reserved',
    html: "QR Code: <img src='cid:"+otp+"'/><br><p>Thanks for Reserving a table with us, your OTP is " + otp + " Show this QR/OTP at the counter to confirm the table.</p>",
    attachments: [{
        filename: otp+'.png',
        path: './public/otps/'+otp+'.png',
        cid: otp
    }]
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  Post.create({
    ...req.body,
    author: req.session.userId,
    otp: otp,
  }, (error, post) => {
    res.redirect("/menu");
  });
}