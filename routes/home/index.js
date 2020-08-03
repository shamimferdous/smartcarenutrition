const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const Order = require('../../models/Order');
const User = require('../../models/User');
const paypal = require('paypal-rest-sdk');
const { cartTotal } = require('../../helpers/checkout-helper');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AXwmaYYHarZ_vdotITtoSFV2WLAKLHtiUXJE9S9GQfGZLrGpUfyVrkiXU8SPUKHi8EYZHUOyN-AA9xUS',
    'client_secret': 'EPHwxJR_QdQR_FtGVYMKqxK9LoQ6T5qotlbtFjZ6NnqGPQ0mYiSGhKZrGU5Akh1qYc_qcTS-KhwjYUJH'
});


/*>> This is a middleware that overides the default handlebar settings set to 'home' */
router.all('/*', (req, res, next) => {

    req.app.locals.layout = 'home';
    next();

});
/*<< This is a middleware that overides the default handlebar settings set to 'home' */


/*>> Creating Routes */

//landing page get route
router.get('/', (req, res) => {

    res.render('home/landing', { cart: req.session.cart });
});


//alpha whey get route
router.get('/alpha-whey', (req, res) => {
    res.render('home/alpha-whey', { cart: req.session.cart });
});


//alpha amino get route
router.get('/alpha-amino', (req, res) => {
    res.render('home/alpha-amino', { cart: req.session.cart });
});


//alpha push get route
router.get('/alpha-push', (req, res) => {
    res.render('home/alpha-push', { cart: req.session.cart });
});


//alpha crea get route
router.get('/alpha-crea', (req, res) => {
    res.render('home/alpha-crea', { cart: req.session.cart });
});


//quantity checkout get route
router.get('/checkout-quantity/:productName', (req, res) => {

    console.log(req.params.productName);

    Product.findOne({ name: req.params.productName }).lean().then(product => {

        console.log(product);
        res.render('home/checkout-quantity', { product: product, cart: req.session.cart });

    });
});


//database ping route
router.get('/database-ping', (req, res) => {
 
        const newUser = new User({

            fullName: 'Alpha Admin',
            email: 'admin@smartcarenutrition.es',
            //cellNumber: req.session.checkoutData.cellNumber,
            role: '31469',
            password: 'alphaAdmin2441139'
        });

        //securing the password
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {

                newUser.password = hash;

                newUser.save();

            });
        });

});



//add to cart post route
router.post('/add-to-cart', (req, res) => {

    if (req.session.count == null) {
        req.session.count = 'Shamim Bhai';
        req.session.cart = [];
        req.session.cart.push({ ...req.body });

        console.log(req.session.cart);
        console.log('Cart Null Positive');
    } else {
        req.session.cart.push({ ...req.body });

        console.log(req.session.cart);
        console.log('Cart Null Negative');
    }

    res.redirect('/#products');

});



//remove from cart route
router.get('/remove-from-cart/:productID', (req, res) => {

    let i;

    for (i = 0; i < req.session.cart.length; i++) {
        if (req.session.cart[i].productID === req.params.productID) {
            console.log(i);
            const index = req.session.cart.indexOf(req.session.cart[i]);
            req.session.cart.splice(index, 1);
        }
    }

    res.redirect('/');

});



//checkout get route
router.get('/checkout', (req, res) => {

    console.log(req.session.cart);

    if (!req.session.cart) {
        res.redirect('/');
    } else {
        res.render('home/checkout', { cart: req.session.cart });
    }

});



//checkout pay post route
router.post('/pay', (req, res) => {
    console.log(`Payment api Hit`);

    console.log(req.body);

    req.session.checkoutData = req.body;


    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://smartcarenutrition.herokuapp.com/success", //http://smartcarenutrition.herokuapp.com/success
            "cancel_url": "http://smartcarenutrition.herokuapp.com/#products"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Alpha Products",
                    "sku": "6969",
                    "price": cartTotal(req.session.cart),
                    "currency": "EUR",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "EUR",
                "total": cartTotal(req.session.cart)
            },
            "description": "Paying to Smart Care Neutration"
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {

            console.log(payment);

            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });

});


//paypal payment success route
router.get('/success', (req, res) => {

    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "EUR",
                "total": cartTotal(req.session.cart)
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            //res.send('Success');

            //order id
            let str = 'S' + Date.now();
            let theOrderID = 'SCN' + str.slice(5) + Math.random().toString().slice(2, 5);
            console.log(theOrderID);

            // //creating new user if user doesn't exist
            // User.findOne({ email: req.session.checkoutData.emailAddress }).then(user => {

            //     if (!user) {

            //         const newUser = new User({

            //             fullName: req.session.checkoutData.fullName,
            //             email: req.session.checkoutData.emailAddress,
            //             //cellNumber: req.session.checkoutData.cellNumber,
            //             role: '31435',
            //             password: req.session.checkoutData.password,
            //             orders: theOrderID
            //         });

            //         //securing the password
            //         bcrypt.genSalt(10, (err, salt) => {
            //             bcrypt.hash(newUser.password, salt, (err, hash) => {

            //                 newUser.password = hash;

            //                 newUser.save();

            //             });
            //         });

            //     } else { 
            //         console.log(`User Found!`);
            //         user.orders.push(theOrderID);
            //         user.save();
            //     }

            //user created! now creating the order
            const newOrder = new Order({

                cart: req.session.cart,
                orderID: theOrderID,
                customerName: req.session.checkoutData.customerName,
                customerEmail: req.session.checkoutData.emailAddress,
                customerCell: req.session.checkoutData.cellNumber,
                shippingAddress: `Country: ${req.session.checkoutData.shippingCountry}, City: ${req.session.checkoutData.shippingCity}, Zip Code: ${req.session.checkoutData.shippingZIP}, Address: ${req.session.checkoutData.shippingAddress}`,
                date: Date.now(),
                total: cartTotal(req.session.cart),
                paypalPayID: payment.id,
                orderStatus: 'Paid & Received'

            });

            newOrder.save().then(savedOrder => {

                //clearing all session datas
                req.session.count = null;
                req.session.cart = [];
                req.session.checkoutData = null;

                res.redirect(`/success-message/${payment.id}/${theOrderID}`);
                console.log(req.session.cart);
            });

            // });
        }
    });
});



//success message get route
router.get('/success-message/:paypalPayID/:orderID', (req, res) => {

    res.render('home/success', { cart: req.session.cart, paypalPayID: req.params.paypalPayID, orderID: req.params.orderID });

});




//login page get route
router.get('/log-IN', (req, res) => {

    res.render('home/login');

});


//login post route
router.post('/loginNOW', passport.authenticate('local-login', {
    failureRedirect: '/log-IN',
    failureFlash: true
}), (req, res, next) => {

    if (req.user.isAdmin()) {
        res.redirect('/admin');
    } else {
        res.redirect('/user-dashboard');
    }

});



//my orders get route
router.get('/my-orders', (req, res) => {

    res.render('home/my-orders', { cart: req.session.cart });

});



//user dashboard get route
router.post('/user-dashboard', (req, res) => {

    Order.find({ customerEmail: req.body.email }).lean().sort({ _id: -1 }).then(orders => {
        if (orders.length === 0) {
            console.log('Empty');
            req.flash('error_message', `Incorrect Email Address. Please Recheck and Submit Again!`);
            res.redirect('/my-orders');
        } else {
            res.render('home/user-dashboard', { orders: orders });
        }
    });

});


/*>> Creating Routes */


//exporting all routes
module.exports = router;