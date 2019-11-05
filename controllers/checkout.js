const Order = require('../database/models/orders');
const User = require("../database/models/User");
var nodemailer = require('nodemailer');
var QRCode = require('qrcode');

module.exports = async (req, res) => {
    const user = await User.findOne({ _id: req.session.userId });
    const email = user.email;
    var otp = "TFT-F-" + Math.floor(Math.random() * (99999 - 100) + 100);
    
    QRCode.toFile('./public/otps/' + otp + '.png', otp, {
        color: {
            dark: '#000000',  // Blue dots
            light: '#0000' // Transparent background
        }
    }, function (err) {
        if (err) throw err
        console.log('done')
    })

    let a = req.body;
    console.log(a);
    const arr = [];
    for (i = 0; i < a.length - 1; i++) {
        arr.push(a[i]);
    }
    const totalPrice = a[a.length - 1].totalPrice;
    const totalQuantity = a[a.length - 1].totalQuantity;

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
        subject: 'Order Confirmed',
        html: "QR Code: <img src='cid:"+otp+"'/><br><p>Thanks for ordering with us your OTP is " + otp + " Show this OTP at the counter and redeem your order.</p>",
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

    Order.create({
        Products: arr,
        otp: otp,
        user_id: req.session.userId,
        user_name: user.username,
        totalPrice: totalPrice,
        totalQuantity: totalQuantity
    }, (error, order) => {
        if (error) {
            console.log(error);
        }
    })

}