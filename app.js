const express = require('express');
const app = express();
const path = require('path'); //Static file
const expressHandlebars = require('express-handlebars'); 
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const { mongoDBUrl } = require('./config/database');
const passport = require('passport');
const compression = require('compression');
const ssl = require('express-sslify');

//require('dotenv').config();
/*>> Creating Database */
mongoose.set('useCreateIndex', true); //Solution of "collection.ensureindex is deprecated mongoose" warning
mongoose.connect(mongoDBUrl, {useNewUrlParser: true, useUnifiedTopology: true}).then((db)=>{

    console.log('Connection Established With MongoDB Atlas...');

}).catch(error=> console.log(error));
/*<< Creating Database */



/*>> Force SSL & DOTENV */
//app.use(ssl.HTTPS({ trustProtoHeader: true }));
/*<< Force SSL */



console.log(process.env.cookie_secret);

/*>> Session and flash */
app.use(session({

    secret: process.env.cookie_secret,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000 * 10
    }

}));


app.use(flash());





/*>> Passport Authenticator */ //There might be some issues with it's positioning. Look out for it

require('./config/passport')(passport); // pass passport for configuration

app.use(passport.initialize());
app.use(passport.session());
/*>> Passport Authenticator */






//Create new post success flash message and user presence
app.use((req, res, next)=>{

    //This is to show session wise user login. A User is logged in or not
    res.locals.user = req.user || null;

    res.locals.success_message = req.flash('success_message'); //Using this middleware for the success message
    res.locals.error_message = req.flash('error_message');

    res.locals.error = req.flash('error'); //User Login Error Check with passport error
    //res.locals.form_errors = req.flash('form_errors'); //We need to include this to message partial and that to other layout handlebars

    
    next();
});


/*>> Session */





//Express Compression, Gzip
app.use(compression());





//The Static  - setting file directory to public
app.use(express.static(path.join(__dirname, 'public'))); //Static File





/*>> Helper Functions*/ //We will have to take select/generateTime in the app engine also 
//const {select, generateTime, each_upto} = require('./helpers/handlebars-helpers'); //Also need to add it to the app.engine exphbs
/*<< Helper Functions*/

const {select, generateTime, each_upto, paginate, cartLength, cartTotal, cartTotalCheckout} = require('./helpers/handlebars-helpers');
app.engine('handlebars', expressHandlebars({defaultLayout: 'home', helpers: {select: select, generateTime: generateTime, each_upto: each_upto, paginate: paginate, cartLength: cartLength, cartTotal: cartTotal, cartTotalCheckout: cartTotalCheckout}}));
app.set('view engine', 'handlebars');

/*<< Setting View Enginers -- Handlebars*/







/*>> Body Parser */
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
/*<< Body Parser */






/*>> Method Override */
app.use(methodOverride('_method'));
/*<< Method Override */







/*>> Loading All the Routes*/
//Load
const home = require('./routes/home/index.js');
const admin = require('./routes/admin/index.js');


//Use
app.use('/', home); //Everytime someone goes to the root, this executes the main route.js
app.use('/admin', admin); //Everytime someone goes to the admin url, this executes the main route.js




//the 404 route
app.get('*', function(req, res){
    res.status(404);
    res.render('home/404');
  });
/*<< Loading All the Routes*/







const port = process.env.PORT || 7900;

app.listen(port, ()=>{

    console.log(`Server fired at port ${port}`);

});