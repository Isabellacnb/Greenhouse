// User
var mongoose = require("mongoose")
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");

var UserSchema = Schema ({
    name: String,
    email: String,
    password: String,
});

// Function to encrypt password
UserSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, 10)
};

// Function to decrypt password
UserSchema.methods.validatePassword = function(userpassword){
    return bcrypt.compare(userpassword, this.password)
};

module.exports = mongoose.model('users', UserSchema);
