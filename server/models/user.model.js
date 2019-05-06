const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: "Username can't be empty",
    unique: true
  },
  password: {
    type: String,
    required: "Password must be provided",
    minlength: [8, "Password must be 8 characters strong"]
  },
  firstname: {
    type: String,
    required: "First name must be provided"
  },
  lastname: {
    type: String,
    required: "Last name must be provided"
  },
  phone: {
    type: String,
    required: "Phone Number must be provided",
    minlength: [10, "Invalid Phone Number"],
    unique: true
  },
  gender: {
    type: String,
    required: "Gender must be provided"
  },
  saltSecret: String
});

userSchema.pre('save', function (next) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hash) => {
      this.password = hash;
      this.saltSecret = salt;
      console.log(this.password);
      next();
    });
  });
});

userSchema.methods.authenticatePassword = function (requestPassword, dbPassword) {
  return bcrypt.compareSync(requestPassword, dbPassword);
};

const userModel = mongoose.model('users', userSchema);

module.exports = { user: userModel }