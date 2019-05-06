const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
        .then(() => {
            console.log('MongoDB UserDB Connected!!!');
        })
        .catch((err) => {
            console.log('Error in connectionn: '+err);
        });
};