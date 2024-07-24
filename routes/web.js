const express = require("express");
const FrontController = require("../controllers/FrontController");
const route = express.Router() 
const checkUseAuth = require('../middleware/auth');
const authRoles = require('../middleware/adminrole');
const isLogin = require('../middleware/isLogin');
const CourseController = require("../controllers/CourseController");
const AdminController = require("../controllers/AdminController");



   
// route localhost:3000(/)
route.get("/", isLogin,FrontController.login);  // static method hamesha class k name se call hota hai
route.get("/register",FrontController.register);
route.get("/home", checkUseAuth,FrontController.home);
route.get("/about", checkUseAuth,FrontController.about)
route.get("/contact", checkUseAuth,FrontController.contact)
route.get("/team",FrontController.team)

//insert user
route.post("/insertuser",FrontController.insertUser);     // form se data le jane k liye hamesha post ka use karte hai 
route.post("/verifyLogin",FrontController.verifyLogin);
route.get("/logout",FrontController.logout);
route.get("/profile",checkUseAuth,FrontController.profile);
route.post('/updateProfile',checkUseAuth,FrontController.updateProfile)
route.post('/changePassword',checkUseAuth,FrontController.changePassword)
route.get('/verify', FrontController.verifyMail)
route.get('/forgotpassword', FrontController.forgotPassword)
route.post('/forget_password',FrontController.forgetPasswordVerify)
route.get('/reset-password',FrontController.resetPassword)
route.post('/reset_password1',FrontController.reset_password1)   

//courseController
route.post("/courseInsert",checkUseAuth,CourseController.courseInsert)
route.get("/courseDisplay",checkUseAuth,CourseController.courseDisplay) 
route.get("/courseView/:id",checkUseAuth,CourseController.courseView)
route.get("/courseDelete/:id",checkUseAuth,CourseController.courseDelete)
route.get("/courseEdit/:id",checkUseAuth,CourseController.courseEdit)
route.post("/courseUpdate/:id",checkUseAuth,CourseController.courseUpdate) 



//admin part
route.get("/admin/dashboard",checkUseAuth, authRoles('admin'),AdminController.dashboard)
route.get("/admin/courseDisplay" ,checkUseAuth, authRoles('admin'), AdminController.display)
route.get("/adminView/:id", checkUseAuth, authRoles('admin'),AdminController.adminView)
route.get("/adminEdit/:id" , checkUseAuth, authRoles('admin'),AdminController.adminEdit)
route.get("/adminDel/:id", checkUseAuth, authRoles('admin'),AdminController.adminDel)
route.post("/update_status/:id" , checkUseAuth, authRoles('admin'),AdminController.updatestatus)
module.exports=route;        