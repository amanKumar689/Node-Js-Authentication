const mongoose = require('mongoose')

const structure = new mongoose.Schema( {

    username :{
        type :String,
        required :true
    },
    email :{
        type :String,
        required :true
    },
    password :{
        type :String,
        required :true
    },
    date :{
        type:Date,
        default: Date.now
    }

});

const user = mongoose.model('user', structure);
module.exports = user