const express=require('express')
const {check} = require('express-validator')

const Auth= require('../controllers/authController')
const Password=require('../controllers/passwordController')
const validate=require('../middlewares/validate')

const router=express.Router()


router.get('/',(req,res)=>{
    res.status(200).json({
        message:'you are at the auth route'
    })
})

router.post('/register',[
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('username').not().isEmpty().withMessage('Username is required'),
    check('password').not().isEmpty().isLength({min:6}).withMessage('must be atleast 6 characters')
], validate,Auth.register)

router.post('/login',[
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').not().isEmpty()
], validate ,Auth.login)


router.get('/verify/:token',Auth.verify)
router.post('/resend',Auth.resendToken)

router.post('/recover',[
    check('email').isEmail().withMessage('Enter a valid email address')
] , validate,Password.recover)

router.get('/reset/:token',Password.reset)

//router.post('/reset/:token',[
  //  check('password').not().isEmpty().isLength({min:6}).withMessage('Must be 6 characters and above'),
    //check('confirmPassword','Password does not match').custom((value,{req})=>( value === req.body.password))
//],validate,Password.resetPassword)


module.exports=router