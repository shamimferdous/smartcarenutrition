const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');
const Coupon = require('../../models/Coupon');

//router all
router.all('/*', (req, res, next) => {

    if (req.isAuthenticated() && req.user.isAdmin()) {
        res.app.locals.layout = 'admin';
        next();
    } else {
        res.redirect('/log-IN');
    }

});

/*>> Creating Routes */

//main index get route
router.get('/', (req, res) => {

    res.render('admin/index');

});


//orders get route
router.get('/orders', (req, res) => {

    Order.find({}).limit(50).sort({ _id: -1 }).lean().then(orders => {
        res.render('admin/orders', { orders: orders });
    });

});



//order details get route
router.get('/order-details/:orderID', (req, res) => {

    Order.findOne({ orderID: req.params.orderID }).lean().then(order => {
        res.render('admin/order-details', { order: order });
    });

});


//logout route
router.get('/log-oUt', (req, res)=>{

    req.logOut();
    res.redirect('/log-IN');

});


//order status update put route
router.put('/order-status-update', (req, res)=>{
    
    Order.findOne({_id: req.body._id}).then(order =>{
        console.log(order);
        order.orderStatus = req.body.orderStatus;
        order.save().then(savedOrder=>{
            res.redirect('/admin/orders');
        });
    });
});


//coupons get route
router.get('/coupons', (req, res)=>{

    Coupon.find({}).sort({_id: -1}).lean().then(coupons=>{
        res.render('admin/coupons', { coupons: coupons });
    })

});


//create coupon post route
router.post('/create-coupon', (req, res)=>{

    console.log(req.body);

    const newCoupon = new Coupon({
        couponCode: req.body.couponCode,
        couponValue: req.body.couponValue

    });

    newCoupon.save().then(savedCoupon=>{
        res.redirect('/admin/coupons');
    })
});


//coupon delete route
router.delete('/coupon-delete', (req, res)=>{

    console.log(req.body.couponID);

    Coupon.findOneAndDelete({_id: req.body.couponID}).then(deletedCoupon=>{
        res.redirect('/admin/coupons');
    });

});
/*>> Creating Routes */


//exporting all rotues
module.exports = router;