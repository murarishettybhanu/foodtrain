const Order = require("../database/models/orders");

module.exports = async (req,res) =>{
    const orders = await Order.find({}).sort({createdAt:-1});
    res.render("orders",{
        orders
    })
}