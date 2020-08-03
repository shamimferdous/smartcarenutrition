const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({

    customerName: {
        type: String
    },

    customerEmail: {
        type: String
    },

    customerCell: {
        type: String
    },

    cart: [{
        productName: String,
        productQuantity: Number,
        productPrice: String,
        productID: Number
    }],

    total: {
        type: Number
    },

    date: {
        type: Date
    },

    orderID: {
        type: String
    },

    paypalPayID: {
        type: String
    },

    orderStatus: {
        type: String
    }, 

    shippingAddress: {
        type: String
    }
});

module.exports = mongoose.model('orders', OrderSchema);