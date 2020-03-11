const passport=require('passport')

module.exports = (req,res,next)=>{
    passport.authenticate('jwt',function(err,user,info){
        if(err) return next(err)

        if(!user)return res.status(401).json({Message:'unathorized - no token provided'})
        req.user=user
        
      
    next()  
    })
    (req,res,next)
}