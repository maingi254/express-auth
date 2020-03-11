const User=require('../models/user_model')

const sgMail=require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.recover= async(req, res)=>{
    try {
        const {email}=req.body
        
            const user=await User.findOne({email})
            if(!user)  return res.status(401).json({message:'The emai address ' + req.body.email +' is not associated with any account.Please check again '})
            user.generatePasswordReset()
            user.save()
                .then(user=>{

                    let link= "http://" + req.headers.host +"/api/auth/reset" +user.resetPasswordToken
                    const mailOptions={
                        to:user.email,
                        from:process.env.FROM_EMAIL,
                        subject:"Password Reset ",
                        text:`Hi ${user.username} \n
                            Please click on the following link ${link} to reset your password. \n \n
                              If you didnt request this,please ignore it` 
                    }

                    sgMail.send(mailOptions,(error,result)=>{
                        if(error) return res.status(500).json({message:error.message})
                        res.status(200).json({
                            message:'A reset Email sent to '+user.email +''
                        })
                    })
                }).catch(err => res.status(500).json({
                    message:err.message
                }))
        
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}


exports.reset=async(req,res)=>{
    try {
        const {token}=req.params
        const user=await User.findOne({resetPasswordToken:token, resetPasswordExpires:{$gt:Date.now()}})
            .then((user)=>{
                if(!user) return res.status(401).json({message:'Password token is invalid'})

                user.password=req.body.password
                user.resetPasswordToken=undefined
                user.resetPasswordExpires=undefined
                user.isVerified= true

                user.save((err)=>{
                    if(err) return res.status(500).json({message:err.message})

                    const mailOptions={
                        to:user.email,
                        from:process.env.FROM_EMAIL,
                        subject:"Your password has been changed",
                        text:`Hi ${user.username}  \n
                            This is the confirmation that the password  for the account ${user.email} has been changed \n`
                    }

                    sgMail.send(mailOptions,(error,result)=>{
                        if(error) return res.status(500).json({message:error.message})

                        res.status(200).json({message:'Your password has been updated'})
                    })
                })
            })
    } catch (error) {
        
    }
}