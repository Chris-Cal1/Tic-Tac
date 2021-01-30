var express = require('express');
var router = express.Router();

var userModel = require('../models/user')



/* Post Sign-in */
router.post('/sign-in', async function(req, res, next) {

  //console.log(' /sign-In : result from the front -->',req.body)

 var user = await userModel.find({ email: req.body.signInEmail, password: req.body.signInPassword })
 if(user.length > 0){

   //console.log(' /sign IN : We do have a user with this email')

   // Session
   req.session.user = user[0]

   // We can render the next page 
   res.render('index', {user:req.session.user });

 }else{

   //console.log(' /Sign IN : We dont have a user with this email, so he needs to sign-up first')

   // We can render the next page 
   res.render('login', {alertMessage:'You need to sign-up first' });
   
 }
 
});

/* Post Sign-up */
router.post('/sign-up', async function(req, res, next) {

 // console.log(' /Sign-Up : result from the front -->',req.body)

 var user = await userModel.find({ email: req.body.signUpEmail })
 
 if(user.length > 0){

   //console.log('We already have a user with this email')

   // Session
   req.session.user = user

   // We can render the next page 
   res.render('index', { title: 'Express',user:req.session.user });

 }else{

   //console.log(' /Sign-UP : We dont have a user with this email, so we need to save it')

   var newUser = new userModel ({
     name: req.body.signUpName, 
     firstName: req.body.signUpFirstName, 
     password: req.body.signUpPassword, 
     email: req.body.signUpEmail, 
   });

   await newUser.save()

   //console.log(' /Sign-UP : Our new user -->',newUser)

   // Session
   req.session.user = newUser

   // We can render the next page 
   res.render('index', {user: req.session.user});
   
 }  
});


module.exports = router;
