const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt =  require('bcryptjs'); 


const UserSchema = new Schema({


    fullName: {
        type: String,
        //require: true
    },


    email: {
        type: String,
        required: true
    },


    role: {
        type: String,
        enum: ['31435', '31469'],
        required: true
    },

    password: {
        type: String,
        required: true
    },

    orders: [{
        type: String
    }]
    

});




/*Mad Guy */

// methods ======================
// we have two type of methods: 'methods', and 'statics'.
// 'methods' are private to instances of the object User, which allows the use of 'this' keyword.
// 'statics' are attached to the user object, so that you don't need an instance of the object created with the keyword 'new' to actually call the function.

// generating a hash
// passwords are not saved to the database as is. Instead, they are hashed first, then saved.
// hashes are always the same for the same password given the same "salt".
UserSchema.statics.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
// this method takes the password, hashes it, and compares it to the user's own password
// when the two hashes are equal, it means the passwords match
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.isAdmin = function() {
    return (this.role === "31469");
};
// UserSchema.methods.isMasterAdmin = function() {
//     return (this.role === "MasterAdmin");
// };








module.exports = mongoose.model('users', UserSchema);