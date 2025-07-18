const router=require('express').Router();
const {signup,login}=require('../Controllers/AuthController');
const {signupValidation,loginValidation}=require('../Middleweres/AuthValidation')
// router.post('/login',(req,res)=>{
//     console.log("auth /login post rout hit")
//     res.send("Login successfull")
// });
router.post('/login',loginValidation,login);
router.post('/signup',signupValidation,signup);
module.exports=router;