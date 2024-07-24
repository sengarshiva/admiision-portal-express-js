const mongoose = require('mongoose');

const CourseSchema= new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        require:true
    },
   dob: {
        type: String,
        require:true
    },
    address:{
        type: String,
        require:true
    },
    gender:{
        type:String,
        require:true

    },
    education:{
        type:String,
        require:true
    },
    course:{
        type:String,
        require:true
    },
    user_id:{
        type:String,
        require:true,


    },
    status:{
        type:String,
        default:'pending'
    },
    comment:{
        type:String,
        default:'pending'
    }


},
 { timestamps: true}) // jb hum insert karenge to 2 field dega  

const CourseModel = mongoose.model('course',CourseSchema)

module.exports =CourseModel