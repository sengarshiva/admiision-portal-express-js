const UserModel = require('../models/user')
const CourseModel = require('../models/course')
const TeacherModel = require('../models/teacher')
const bcrypt = require('bcrypt')
const cloudinary = require("cloudinary")
const jwt = require('jsonwebtoken')
const nodeMailer = require("nodemailer")
const randomstring = require("randomstring");


cloudinary.config({
    cloud_name: 'dvcyo6wwv',
    api_key: '575927895447323',
    api_secret: 'wAEktf0XCTGOeUFFVCC9E3kRgYQ'
});

class FrontController {
    static login = async (req, res) => {
        try {
            res.render("login", { msg: req.flash('success'), msg1: req.flash('error') });
        } catch (error) {
            console.log(error);       // send ki jgh render ka use karenge  render sidha jump karega views k folder pr or search karega ki file kha hai

        }
    };
    static register = async (req, res) => {
        try {
            res.render("register", { msg: req.flash('error') });
        } catch (error) {
            console.log(error);

        }
    };
    static home = async (req, res) => {
        try {
            const { name, email, image, id, role } = req.data;
            const btech = await CourseModel.findOne({ user_id: id, course: "B.Tech" });
            const mtech = await CourseModel.findOne({ user_id: id, course: "M.Tech" });
            const bba = await CourseModel.findOne({ user_id: id, course: "B.B.A" });
            const mba = await CourseModel.findOne({ user_id: id, course: "M.B.A" });

            //console.log(btech)
            res.render("home", {
                n: name,
                i: image,
                e: email,
                btech: btech,
                mtech: mtech,
                bba: bba,
                mba: mba,
                r: role,
            });
        } catch (error) {
            console.log(error)

        }
    }
    static about = async (req, res) => {
        try {
            const { name, email, image } = req.data
            res.render("about", { n: name, i: image })
        } catch (error) {
            console.log(error)

        }
    }
    static contact = async (req, res) => {
        try {
            const { name, email, image } = req.data
            res.render("contact", { n: name, i: image })
        } catch (error) {
            console.log(error);

        }
    }
    static team = async (req, res) => {
        try {
            res.render("team")
        } catch (error) {
            console.log(error)

        }
    }


    //insert User
    static insertUser = async (req, res) => {
        try {
            //console.log(req.files.image)
            const file = req.files.image

            // image upload cloudinary
            const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "userprofile",
            });

            //console.log(imageUpload)

            const { n, e, p, cp } = req.body     // form m jo data fill karte hai vo data req.body m uth k aata hai
            const user = await UserModel.findOne({ email: e })
            // //console.log(user)
            if (user) {
                req.flash("error", "email already exists.")
                res.redirect("/register")

            } else {
                if (n && e && p && cp) {
                    if (p == cp) {
                        const hashpassword = await bcrypt.hash(p, 10)    // password ko strong karne k liye .
                        const result = new UserModel({
                            name: n,
                            email: e,
                            password: hashpassword,
                            image: {
                                public_id: imageUpload.public_id,
                                url: imageUpload.secure_url
                            }
                        })
                        const userdata = await result.save();         // await result.save ka use data ko result m save krne k liye hota hai.
                        //console.log(userdata)
                        if (userdata) {
                            const token = jwt.sign({ ID: userdata._id }, 'shivasengar09');
                            //console.log(token)
                            res.cookie('token', token);
                            this.sendVerifymail(n, e, userdata._id);
                            //To redirect to login page
                            req.flash(
                                "error",
                                "Your Registration has been successfully.Please verify your mail. ."
                            );
                            res.redirect("/register");
                        }
                        req.flash("success", "Register success plz login.");
                        res.redirect("/")   // url

                    } else {
                        req.flash("error", "confirm password does not match with password.");
                        res.redirect("/register")

                    }

                } else {
                    req.flash("error", "all fields are required")
                    res.redirect("/register")

                }

            }

        } catch (error) {
            console.log(error)

        }
    };

    static verifyLogin = async (req, res) => {
        try {
            //console.log(req.body)
            const { email, password } = req.body
            const user = await UserModel.findOne({ email: email })
            console.log(user)
            if (user != null) {
                const ismatch = await bcrypt.compare(password, user.password)
                // console.log(ismatch)
                if (ismatch) {
                    if (user.role == 'user' && user.is_verified == 1) {
                        const token = jwt.sign({ ID: user._id }, 'shivasengar09');
                        //console.log(token)
                        res.cookie('token', token);
                        res.redirect("/home");
                    } else if (user.role == 'admin' && user.is_verified == 1) {
                        const token = jwt.sign({ ID: user._id }, 'shivasengar09');
                        //console.log(token)
                        res.cookie('token', token);
                        res.redirect("/admin/dashboard");
                    } else {
                        req.flash("error", "please verify your email address.")
                        res.redirect("/")
                    }
                    //token

                } else {
                    req.flash("error", "Email or password is not valid.")
                    res.redirect("/")
                }

            } else {
                req.flash("error", "you are not a register user.")
                res.redirect("/")

            }


        } catch (error) {
            console.log(error)

        }
    }

    static logout = async (req, res) => {
        try {
            res.clearCookie("token");
            res.redirect('/')
        } catch (error) {
            console.log(error)

        }
    };


    //profile
    static profile = async (req, res) => {
        try {
            const { name, email, image } = req.data
            res.render("profile", { n: name, i: image, e: email })
        } catch (error) {
            console.log(error);

        }
    };
    // change password
    static changePassword = async (req, res) => {
        try {
            const { id } = req.data;
            //console.log(req.body)
            const { op, np, cp } = req.body;
            if (op && np && cp) {
                const user = await UserModel.findById(id);
                const isMatched = await bcrypt.compare(op, user.password);
                //console.log(isMatched)
                if (!isMatched) {
                    req.flash("error", "Current password is incorrect ");
                    res.redirect("/profile");
                } else {
                    if (np != cp) {
                        req.flash("error", "Password does not match");
                        res.redirect("/profile");
                    } else {
                        const newHashPassword = await bcrypt.hash(np, 10);
                        await UserModel.findByIdAndUpdate(id, {
                            password: newHashPassword,
                        });
                        req.flash("success", "Password Updated successfully ");
                        res.redirect("/");
                    }
                }
            } else {
                req.flash("error", "ALL fields are required ");
                res.redirect("/profile");
            }
        } catch (error) {
            console.log(error);
        }
    };
    //   Update Profile
    static updateProfile = async (req, res) => {
        try {
            const { id } = req.data;
            const { name, email, role } = req.body;
            if (req.files) {
                const user = await UserModel.findById(id);
                const imageID = user.image.public_id;
                console.log(imageID);

                //deleting image from Cloudinary
                await cloudinary.uploader.destroy(imageID);
                //new image update
                const imagefile = req.files.image;
                const imageupload = await cloudinary.uploader.upload(
                    imagefile.tempFilePath,
                    {
                        folder: "userprofile",
                    }
                );
                var data = {
                    name: name,
                    email: email,
                    image: {
                        public_id: imageupload.public_id,
                        url: imageupload.secure_url,
                    },
                };
            } else {
                var data = {
                    name: name,
                    email: email,
                };
            }
            await UserModel.findByIdAndUpdate(id, data);
            req.flash("success", "Update Profile successfully");
            res.redirect("/profile");
        } catch (error) {
            console.log(error);
        }
    };
    static sendVerifymail = async (n, e, user_id) => {
        //console.log(name, email, user_id);
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
            to: e, // list of receivers
            subject: "For Verification mail", // Subject line
            text: "hello", // plain text body
            html:
                "<p>Hii " +
                n +
                ',Please click here to <a href="http://localhost:3000/verify?id=' +
                user_id +
                '">Verify</a>Your mail</p>.',
        });
        //console.log(info);
    };
    static verifyMail = async (req, res) => {
        try {
            const updateinfo = await UserModel.findByIdAndUpdate(req.query.id, {
                is_verified: 1,
            });
            if (updateinfo) {
                res.redirect("/home");
            }
        } catch (error) {
            console.log(error)
        }
    };
    static forgotPassword = async (req, res) => {
        try {
            res.render("forgotPassword", { msg: req.flash("error") });
        } catch (error) {
            console.log(error);
        }
    };
    static forgetPasswordVerify = async (req, res) => {
        try {
            const { email } = req.body;
            const userData = await UserModel.findOne({ email: email });
            //console.log(userData)
            if (userData) {
                const randomString = randomstring.generate();
                await UserModel.updateOne(
                    { email: email },
                    { $set: { token: randomString } }
                );
                this.sendEmail(userData.name, userData.email, randomString);
                req.flash("success", "Plz Check Your mail to reset Your Password!");
                res.redirect("/");
            } else {
                req.flash("error", "You are not a registered Email");
                res.redirect("/forgotpassword");
            }
        } catch (error) {
            console.log(error);
        }
    };
    static sendEmail = async (name, email, token) => {
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
            subject: "Reset Password", // Subject line
            text: "heelo", // plain text body
            html:
                "<p>Hii " +
                name +
                ',Please click here to <a href="http://localhost:3000/reset-password?token=' +
                token +
                '">Reset</a>Your Password.',
        });
    };
    static resetPassword = async (req, res) => {
        try {
            const token = req.query.token;
            const tokenData = await UserModel.findOne({ token: token });
            if (tokenData) {
                res.render("reset-password", { user_id: tokenData._id });
            } else {
                res.render("404");
            }
        } catch (error) {
            console.log(error)
        }
    };
    static reset_password1 = async (req, res) => {
        try {
            const { password, user_id } = req.body;
            const newHashPassword = await bcrypt.hash(password, 10);
            await UserModel.findByIdAndUpdate(user_id, {
                password: newHashPassword,
                token: "",
            });
            req.flash("success", "Reset password Updated successfully");
            res.redirect("/");
        } catch (error) {
            console.log(error);
        };
    }


}


module.exports = FrontController;