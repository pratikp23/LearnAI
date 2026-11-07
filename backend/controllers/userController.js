import uploadOnCloudinary from "../configs/cloudinary.js";
import User from "../models/userModel.js";

export const getCurrentUser = async (req,res) => {
    try {
        const user = await User.findById(req.userId).select("-password").populate("enrolledCourses")
         if(!user){
            return res.status(404).json({message:"User profile not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        console.error("getCurrentUser error:", error);
        return res.status(500).json({message:"Unable to retrieve user profile."})
    }
}

export const UpdateProfile = async (req,res) => {
    try {
        const userId = req.userId
        const {name , description} = req.body
        let photoUrl
        if(req.file){
           photoUrl =await uploadOnCloudinary(req.file.path)
        }
        const user = await User.findByIdAndUpdate(userId,{name,description,photoUrl}, {new: true})

        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        console.error("UpdateProfile error:", error);
        return res.status(500).json({message:"Failed to update profile. Please try again."})
    }
}
