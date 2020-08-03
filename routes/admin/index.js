const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');

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

/*>> Creating Routes */


//exporting all rotues
module.exports = router;