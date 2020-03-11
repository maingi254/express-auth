const User=require('../models/user_model')

//const sgMail=require('@sendgrid/mail')
//sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const Token = require('../models/token')

exports.register= async (req,res)=>{
    try {
        const {email} =req.body;

        const user=await User.findOne({email})
        if(user) return res.status(401).json({message:'Email address entered already in use'})

        const newUser=new User({...req.body,role:'basic'})
        const user_=await newUser.save()
        res.status(200).json(user_)
//       sendEmail(user_,req,res)

    } catch (error) {
        res.status(500).json({success:false,message:error.message})
        
    }
}


exports.login= async(req,res)=>{
    try {
        const {email,password} = req.body
        const user=await User.findOne({email})
        if(!user)return res.status(401).json({message:'the email address '+ email + 'is invalid'})

        if(!user.comparePassword(password)) return res.status(401).json({message:'invalid email or password'})

        //if(!user.isVerified) return res.status(401).json({type:'not-Verified', message:'Your account has not been verified'})

        res.status(200).json({token:user.generateJWT(),user:user})
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}



exports.verify=async(req,res)=>{
    if(!req.params.token) return res.status(400).json({
        message:'we are  unable to find a user token'
    })
    try {
        const token =await Token.findOne({token:req.params.token})
        if(!token) return res.status(400).json({
            message:'we are unable to find a valid token'
        })
        User.findOne({_id:token.userId}, (err,user)=>{
            if(!user) return res.status(400).json({
                messsage:'We are unable to find a user for the token'
            })
            if(user.isVerified) return res.status(400).json({
                message:'user is already verified'
            })

            user.isVerified=true
            user.save(function(err){
                if(err) return res.status(500).json({
                    message:err.message
                })
                return res.status(200).json({
                    message:'account is verified please log in'
                })
            })
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}


exports.resendToken=async(req,res)=>{
    try {
        const {email} =req.body
        const user=User.findOne({email})

        if(!user) return res.status(401).json({
            message:'The email ' + req.email+ 'is not associated with any account ..double check the email'
        })
        if(user.isVerified)return res.status(400).json({
            message:'this account is already verified'
        })

        sendEmail(user,req,res);
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}



//function sendEmail(user,req,res){
    //const token=user.generateVerificationToken()
    //token.save(function(err){
      //  res.status(500).json({message:err.message})
    //})
  //  let link="http://"+ req.headers.host +"/api/auth/verify/" + token.token;


    //const mailOptions={
    //    to:user.email,
  //      from:process.env.FROM_EMAIL,
//        subject:'Account Verification  Token',
      //  text:`Hi ${user.username}   \n        Please  click on the following link ${link} to verify your account.\n \n    If you did not request this , Please ignore this email. \n`
    //}


    //sgMail.send(mailOptions,(err,result)=>{
        //if(error) return res.status(500).json({
        //    message:error.message
      //  })

       // res.status(200).json({
      //      message:'a verification email has been sent  to '+ user.email+'.'
    //    })
  //  })
//}