const Order = require("../database/models/orders");
const User = require("../database/models/User");

module.exports = async (req, res) => {
    const orders = await Order.find({ user_id: req.session.userId }).sort({createdAt:-1});
    const user = await User.findById(req.session.userId)
    res.render("myorders", {
        orders, user
    })
}