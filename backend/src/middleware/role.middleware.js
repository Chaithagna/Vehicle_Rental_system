export const verifyRole = (...allowedRoles) => {
    return (req,res,next)=>{
        if(!req.user){
            return res.status(403).json({
                message:"User not found"
            })
        }
        const ifconsists=allowedRoles.some(role => req.user.roles.includes(role));
        if(!ifconsists){
            return res.status(403).json({
                message:"You are not allowed to access this resource"
            })
        }
        next();
    }
}