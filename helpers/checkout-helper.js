module.exports = {

    cartTotal: function(cart) {
        let i, total = 0;

        for(i=0; i<cart.length; i++) {
            total = total + (parseInt(cart[i].productQuantity) * parseInt(cart[i].productPrice));
        }

        return total;
    }

}