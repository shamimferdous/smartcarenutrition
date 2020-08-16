module.exports = {

    cartTotal: function(cart, discount) {
        let i, subTotal = 0, total;

        for(i=0; i<cart.length; i++) {
            subTotal = subTotal + (parseInt(cart[i].productQuantity) * parseInt(cart[i].productPrice));
        }

        total = subTotal - ((subTotal * discount) / 100);

        return total;
    }

}