const mongoose = require('mongoose');

const TeacherSchema= new mongoose.Schema({
    name:{
        type:String,
        require:true 
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
})

const TeacherModel = mongoose.model('teacher',TeacherSchema)

module.exports =TeacherModel