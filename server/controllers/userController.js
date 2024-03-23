// Import necessary modules and models
require("../models/database");
const Recipe = require("../models/Recipe");

const User = require("../models/User");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Function to secure password using bcrypt
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.error("Error securing password:", error);
    throw error;
  }
};

// Function to send verification email
const sendVerifyMail = async (name, email, user_id) => {
  try {
    const transporter = nodemailer.createTransport({
      // your email configuration
    });

    const mailOptions = {
      from: "aarushikhanal.076@kathford.edu.np",
      to: email,
      subject: "For Verification mail",
      html: `<p> Hi ${name}, Please click here to <a href="http://127.0.0.1:3000/verify?id=${user_id}">Verify</a> your mail.</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email has been sent:", info.response);
      }
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

// Function to render user registration page
const loadRegister = async (req, res) => {
  try {
    res.render("users/register", { layout: "layout/layout-no-header" });
  } catch (error) {
    console.error("Error loading register page:", error);
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};

// Function to insert user into the database
const insertUser = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      image: req.file.filename,
      password: spassword,
      mobile: req.body.mno,
      is_admin: 0,
    });

    const userData = await user.save();
    const isLoggedIn = req.session.user ? true : false;

    if (userData) {
      sendVerifyMail(req.body.name, req.body.email, userData._id);
      res.render("users/login", {
        message:
          "Your registration has been successful. Please verify your email.",
        isLoggedIn,
      });
    } else {
      res.render("register", {
        message: "Your registration has failed.",
        isLoggedIn,
      });
    }
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};

// Function to handle email verification
const verifyMail = async (req, res) => {
  try {
    const updateInfo = await User.updateOne(
      { _id: req.query.id },
      { $set: { is_verified: 1 } }
    );

    console.log(updateInfo);
    res.render("users/email-verified");
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};

// Function to render contact us page
const renderContactUs = async (req, res) => {
  try {
    res.render("contact");
  } catch (error) {
    console.error("Error rendering contact us page:", error);
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};

// Function to render login page
const loginLoad = async (req, res) => {
  try {
    res.render("users/login", { layout: "layout/layout-no-header" });
  } catch (error) {
    console.error("Error loading login page:", error);
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};

// Function to handle user login
const verifyLogin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.render("users/login", { message: "Invalid Email or Password" });
      return;
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      res.render("users/login", { message: "Invalid Email or Password" });
      return;
    }
    req.session.user = user;
    req.session.save();
    req.flash("success", "Logged in successfully.");
    if (user.is_admin) return res.redirect("/admin/dashboard");
    return res.redirect("/userdashboard");
  } catch (error) {
    console.error("Error verifying login:", error);
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};

// Function to load the home page
const loadHome = async (req, res) => {
  try {
    const isLoggedIn = req.session.user ? true : false;
    res.render("index", { isLoggedIn });
  } catch (error) {
    console.error("Error loading home page:", error);
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};

// Function to handle user logout
const userLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};

// Function to load the user dashboard
// const loadDashboard = async (req, res) => {
//   try {
//     const usersData = await User.findById(req.session.user_id);
//     const allRecipes = await Recipe.find();
//  // Check if usersData is not null before rendering the template
//  if (usersData !== null) {
//   res.render("users/dashboard", { users: usersData, recipes: allRecipes });
// } else {
//   // Handle the case where usersData is null (e.g., no users found)
//   res.render("users/dashboard", { users: [], recipes: allRecipes });
// }
// } catch (error) {
// console.error("Error loading user dashboard:", error);
// res.status(500).send({ message: error.message || "Error Occurred" });
// }
// };

const loadUserDashboard = async (req, res) => {
  try {
    console.log({ user: req.session.user });
    const userId = req.session.user?._id;

    if (!userId) {
      return res.status(401).send({ message: "User not authenticated" });
    }

    const user = await User.findById(userId);
    const approvalRecipes = await Recipe.find({ approvalStatus: "approved" });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const isLoggedIn = req.session.user ? true : false;
    res.render("users/userdashboard", {
      user,
      recipes: approvalRecipes,
      isLoggedIn,
    });
  } catch (error) {
    console.error("Error loading user dashboard:", error);
    res
      .status(500)
      .send({ message: "Error occurred while loading user dashboard" });
  }
};

// Function to handle user logout
const logout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/login");
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};




//forget password code start......................

const forgetLoad=async(req,res)=>{
  try{
    res.render('users/forget',{ layout: 'layout/layout-no-header' });
  }catch(error){
    console.log(error.message)
  }
};

const forgetVerify=async(req,res)=>{
  try{
    const email=req.body.email;
   const userData=await User.findOne({email:email});
   if(userData){

    if(userData.is_varified ===0){
      res.render('users/forget',{message:"please verify your mail"});
    }else{
      const randomString=randomstring.generate();
     const updatedData=await User.updateOne({email:email},{$set:{token:randomString}});
     sendResetPasswordMail(userData.name,userData.email,randomString);
     res.render('users/forget',{message:"Pleasecheck your mail to reset your password"});
    }
   }else{
    res.render('users/forget',{message:"User email is incorrect"});
   }
  }catch(error){
    console.log(error.message);
  }
};

const forgetPasswordLoad=async(req,res)=>{
  try{
    const token = req.query.token;
    const tokenData=await User.findOne({token:token})
    if(tokenData){
      res.render('users/forget-password',{user_id:tokenData._id});
    }else{
      res.render('users/404',{message:"Tokenis invalid"});
    }
  }catch(error){
    console.log(error.message);
  }
};
const resetPassword=async(req,res)=>{
  try{
    const password=req.body.password;
    const user_id=req.body.user_id;

    const secure_password=await securePassword(password);
   const updatedData=await User.findByIdAndUpdate({_id:user_id},{$set:{password:secure_password,token:''}})
   res.redirect("/login");
  }catch(error){
    console.log(error.message)
  }
};







//user profile update

const editLoad=async(req,res)=>{
  try{
    const id = req.query.id;
  const userData=await  User.findById({_id:id});
  if(userData){
    res.render("users/edit",{user:userData});
  }else{
    res.redirect("/");
  }
  }catch(error){
    console.log(error.message)
  }
};

const updateProfile=async(req,res)=>{
  try{
    if(req.file){
      const userData=await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno,image:req.file.filename}})

    }else{
     const userData=await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno}})
    }
    res.redirect('/')
  }catch(error){
    console.log(error.message)
  }
}






module.exports = {
  loadRegister,
  insertUser,
  verifyMail,
  renderContactUs,
  loginLoad,
  verifyLogin,
  loadHome,
  userLogout,
  loadUserDashboard,
  logout,
  forgetLoad,
  forgetVerify,
  forgetPasswordLoad,
  resetPassword,
};
