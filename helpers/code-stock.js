const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const paypal = require('paypal-rest-sdk');
const { cartTotal } = require('../../helpers/checkout-helper');


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
router.get('/', (req, res)=>{

    res.render('home/landing', {cart: req.session.cart});
});


//alpha whey get route
router.get('/alpha-whey', (req, res)=>{
    res.render('home/alpha-whey', {cart: req.session.cart});
});


//alpha amino get route
router.get('/alpha-amino', (req, res)=>{
    res.render('home/alpha-amino', {cart: req.session.cart});
});


//alpha push get route
router.get('/alpha-push', (req, res)=>{
    res.render('home/alpha-push', {cart: req.session.cart});
});


//alpha crea get route
router.get('/alpha-crea', (req, res)=>{
    res.render('home/alpha-crea', {cart: req.session.cart});
});


//quantity checkout get route
router.get('/checkout-quantity/:productName', (req, res)=>{

    console.log(req.params.productName);

    Product.findOne({name: req.params.productName}).lean().then(product=>{

        console.log(product);
        res.render('home/checkout-quantity', {product: product, cart: req.session.cart});

    });
});


router.get('/database-ping', (req, res)=>{

    const newProduct = new Product({

        name: "Alha Crea",
        price: "15"

    });

    newProduct.save();

});



//add to cart post route
router.post('/add-to-cart', (req, res)=>{

    if(req.session.count == null) {
        req.session.count = 'Shamim Bhai';
        req.session.cart = [];
        req.session.cart.push({...req.body});

        console.log(req.session.cart);
        console.log('Cart Null Positive');
    } else {
        req.session.cart.push({...req.body});

        console.log(req.session.cart);
        console.log('Cart Null Negative');
    }

    res.redirect('/#products');

});

//remove from cart route
router.get('/remove-from-cart/:productID', (req, res)=>{

    let i;

    for(i = 0; i<req.session.cart.length; i++) {
        if(req.session.cart[i].productID === req.params.productID) {
            console.log(i);
            const index = req.session.cart.indexOf(req.session.cart[i]);
            req.session.cart.splice(index, 1);
        }
    }

    res.redirect('/');

});



//checkout get route
router.get('/checkout', (req, res)=>{

    res.render('home/checkout', {cart: req.session.cart});

});



//checkout pay post route
router.post('/pay', (req, res)=>{
    console.log(`Payment api Hit`);

    console.log(cartTotal(req.session.cart));

    
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:6900/success",
            "cancel_url": "http://cancel.url"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Alpha Amino",
                    "sku": "2222",
                    "price": "19.00",
                    "currency": "USD",
                    "quantity": 2
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "38.00"
            },
            "description": "Paying to Smart Care Neutration"
        }]
    };
 
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {

            console.log(payment);
            
            for(let i=0; i<payment.links.length; i++) {
                if(payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });

});


//paypal payment success route
router.get('/success', (req, res)=>{

    const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": "38.00"
        }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        console.log(JSON.stringify(payment));
        res.send('Success');
    }
});

});


/*>> Creating Routes */


//exporting all routes
module.exports = router;