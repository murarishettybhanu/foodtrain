const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
  Products: Array,
  user_id: String,
  otp: String,
  user_name: String,
  totalPrice:String,
  totalQuantity:String,
  createdAt: {
    type: Date,
    default: new Date()
  },
})

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order
