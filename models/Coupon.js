const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CouponSchema = new Schema({

    couponCode: {
        type: String,
        required: true
    },

    couponValue: {
        type: Number,
        required: true
    }

});

module.exports = mongoose.model('coupons', CouponSchema);