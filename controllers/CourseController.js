const CourseModel = require('../models/course')
const nodeMailer= require('nodemailer')
class CourseController {
    static courseInsert = async (req, res) => {
        try {
            // console.log(req.body)
            const { id } = req.data
            const { name, email, phone, dob,education, address, gender, course } = req.body
            const result = new CourseModel({
                name: name,
                email: email,
                phone: phone,
                dob: dob,
                address: address,
                gender: gender,
                education: education,
                course: course,
                user_id: id,

            })

            await result.save()
            this.sendEmail(name,course,email)
            res.redirect('/courseDisplay')
        } catch (error) {
            console.log(error)
        }
    } 
    static courseDisplay = async (req, res) => {
        try {
            // console.log(req.body)
            const { id } = req.data
            const { name, email, image } = req.data
            const data = await CourseModel.find({user_id:id})
            //console.log(data)
            res.render("course/display", { n: name, i: image, e: email, d: data, msg: req.flash('success')  });

        } catch (error) {
            console.log(error)
        }
    }
    static courseView = async (req, res) => {
        try {
            //console.log(req.params.id)
            const { name, email, image } = req.data
            const data = await CourseModel.findById(req.params.id)
            // console.log(data)
            res.render("course/view", { n: name, i: image, e: email, d: data });

        } catch (error) {
            console.log(error)
        }
    }
    static courseEdit = async (req, res) => {
        try {
            //console.log(req.params.id)
            const { name, email, image } = req.data
            const data = await CourseModel.findById(req.params.id)
            // console.log(data)
            res.render("course/edit", { n: name, i: image, e: email, d: data });

        } catch (error) {
            console.log(error)
        }
    }
    static courseUpdate = async (req, res) => {
        try {
            //console.log(req.params.id)
            const { id } = req.data
            const { name, email, phone, dob,education, address, gender, course } = req.body

            const update = await CourseModel.findByIdAndUpdate(req.params.id,{
                name: name,
                email: email,
                phone: phone,
                dob: dob,
                address: address,
                gender: gender,
                education: education,
                course: course,
                user_id: id,
            })
            req.flash("success", "Course Update Successfully.");
            res.redirect('/courseDisplay')

        } catch (error) {
            console.log(error)
        }
    }
    static courseDelete = async (req, res) => {
        try {

            await CourseModel.findByIdAndDelete(req.params.id)
            req.flash("success", "Course Delete Successfully.");
            res.redirect('/courseDisplay')

        } catch (error) {
            console.log(error)
        }
    }
    static sendEmail = async (name,course,email) => {
        // console.log(name,email,status,comment)
        // connenct with the smtp server

        let transporter = await nodeMailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,

            auth: {
                user: "shivasengar08@gmail.com",
                pass: "tzciiqmckalntdtr",
            },
        });
        let info = await transporter.sendMail({
            from: "test@gmail.com", // sender address
            to: email, // list of receivers
            subject: ` Course ${course}`, // Subject line
            text: "heelo", // plain text body
            html: `<b>${name}</b> Course  <b>${course}</b> successful insert! <br>
             `, // html body
        });
    };
    

}

module.exports = CourseController