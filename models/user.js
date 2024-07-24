const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },  
    email: {
        type: String,
        require: true
    }, 
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        default: 'user'
    },
    image: {
        public_id: {
            type: String,
            require: true
        },
        url: {
            type: String,
            require: true
        }
    },
    token: {
        type: String
    },
    is_verified: {
        type: Number,
        default: 0
    }

},
    { timestamps: true }) // jb hum insert karenge to 2 field dega  

const UserModel = mongoose.model('user', UserSchema)

module.exports = UserModel