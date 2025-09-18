import User from "../models/userModal.js";
export const Admin =(req,res,next)=>{
    if (req.user.userRole !=="Admin"){
        return res.status(403).json({message:"Access denied contact Admin please!"})
    };
    next();
};