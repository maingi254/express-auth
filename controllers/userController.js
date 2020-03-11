const User=require('../models/user_model')

//returns all users
exports.index= async function(req,res){
    const users=await User.find({})
    res.status(200).json({users})

}

//show a single user

exports.show=async function(req,res){
    try {
        const id=req.params.id
        const user= await User.findById(id);
        if(!user) return res.status(401).json({message:'User doest exit'})

        res.status(200).json({user})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

//update user
exports.update=async function(req,res){
    try {
        const update=req.body
        const id=req.params.id
        const user_id=req.user_id
        if(user_id.toString() !==id.toString()) return res.status(401).json({
            message:'sorry you dont have permission to update this data'})
        
        const user= await User.findByIdAndUpdate(id,{$set:update},{new:true})
        res.status(200).json({user,message:'User updated successfully'})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}


//delete a user

exports.destroy=async function(req,res){
    try {
        const id=req.params.id
        const user_id=req.user_id

        if(user_id.toString() !==id.toString()) return res.status(401).json({
            message:'Sorry,you dont have permission to delete this data'
        })

        await User.findByIdAndDelete(id)
        res.status(200).json({message:'user has been deleted'})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}