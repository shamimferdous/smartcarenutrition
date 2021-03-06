const moment = require('moment');

//We have to register these functions in the app.js

module.exports = {


    select: function(selected, options){

        //This is used for the public/private/draft status

        return options.fn(this).replace(new RegExp(' value=\"'+selected + '\"'), '$&selected="selected"');


    },

        //This is being used to make the date look pretty
    generateTime: function(date, format){

        return moment(date).format(format);

    }, 

    
    each_upto: function(ary, max, options) {
        if(!ary || ary.length == 0)
            return options.inverse(this);
    
        var result = [ ];
        for(var i = 0; i < max && i < ary.length; ++i)
            result.push(options.fn(ary[i]));
        return result.join('');
    },


    paginate: function(options){

        let output = '';
    
        if(options.hash.current === 1){
            output += `<li class="page-item disabled"> <a class="page-link">First</a> </li>`;
        } else {
            output += `<li class="page-item"> <a href="?page=1" class="page-link">First</a> </li>`;
        }
    
        let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 4 : 1);
    
        if(i != 1){
            output += `<li class="page-item disabled"> <a class="page-link">...</a> </li>`;
        }
    
        for(;i <= (Number(options.hash.current) + 4) && i <= options.hash.pages; i++){
    
            if(i === options.hash.current){
                output += `<li class="page-item active"> <a class="page-link">${i}</a> </li>`;
            } else {
                output += `<li class="page-item"> <a href="?page=${i}" class="page-link">${i}</a> </li>`;
            }
    
            //End Dots
            if(i === Number(options.hash.current) + 4 && i < options.hash.pages){
                
                output += `<li class="page-item disabled"> <a class="page-link">...</a> </li>`;
            }
        
        }
       
    
        if(options.hash.current === options.hash.pages) {
            output += `<li class="page-item" disabled> <a class="page-link">Last</a> </li>`;
        } else {
            output += `<li class="page-item"> <a href="?page=${options.hash.pages}" class="page-link">Last</a> </li>`;
        }
    
        return output;
    },

    cartLength: function(cart) {
        return cart.length;
    },

    cartTotal: function(cart) {
        let i, total = 0;

        for(i=0; i<cart.length; i++) {
            total = total + (parseInt(cart[i].productQuantity) * parseInt(cart[i].productPrice));
        }

        return total;
    },

    cartTotalCheckout: function(cart, discount) {
        let i, subTotal = 0, total;

        for(i=0; i<cart.length; i++) {
            subTotal = subTotal + (parseInt(cart[i].productQuantity) * parseInt(cart[i].productPrice));
        }

        total = subTotal - ((subTotal * discount) / 100);

        return total;
    }


};