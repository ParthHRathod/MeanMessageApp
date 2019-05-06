var env = process.env.NODE_ENV || "development";

var config = require('../config/config.json');

var envConfig = config[env];

// console.log(Object.keys(envConfig));

Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
});