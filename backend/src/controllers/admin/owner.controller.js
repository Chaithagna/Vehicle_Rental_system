import ownerVerification from "../../validations/ownerverification.js";
import User from "../models/User.js";
// get all pending owner verification requests
//GET api/admin/owner-verification
export const getAllPendingVerificationRequests=async(req,res)=>{
    try{
        const verifications=await ownerverification.find({
            status:"pending"
        }).populate("user","name email phone");
        if(!verifications){
            return res.status(404).json({
                message:"No pending verification requests found"
            })
        }
        return res.status(200).json({
            message:"Pending verification requests found successfully",
             count: verifications.length,
            verifications
        });
    }
    catch(error){
        return res.status(500).json({
            message:"Internal server error",
            error:error.message
        })
    }
}
// ==========================================
// Get Verification By Id
// GET /api/admin/owner-verifications/:id
// ==========================================
export const getVerificationById = async (req, res) => {
    try {

        const verification = await OwnerVerification.findById(
            req.params.id
        ).populate("user", "name email phone");

        if (!verification) {
            return res.status(404).json({
                success: false,
                message: "Verification not found"
            });
        }

        return res.status(200).json({
            success: true,
            verification
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};
//aproving owner verification request
//PUT /api/admin/owner-verifications/:id/approve
export const approveOwnerVerification=async(req,res)=>{
    try{
        const verification=await ownerVerification.findById(req.params.id);
        if(!verification){
            return res.status(404).json({
                success:false,
                message:"Verification request not found"
            })
        }
        if(verification.status=="approved"){
            return res.status(400).json({
                success:false,
                message:"Verification request already approved"
            })
        }
        verification.status="approved";
        verification.rejectionReason=null;
        verification.reviewedBy=req.user._id;
        verification.reviewedAt=Date.now();
        await verification.save();
        const user=await User.findById(verification.userId);    
        if(!user){
                return res.status(404).json({
                    success:false,
                    message:"User not found"
                })
        }
        if(!user.roles.includes("owner")){
            user.roles.push("owner");
            await user.save();
        }
        return res.status(200).json({
            message:"approves the owner successfully"
        })


    }
    catch(error){
        return res.status(500).json({
            message:"Internal Server Error",
            error:error.message
        })
    }
}
//rejecting the owner verification request
//put /api/admin/owner-verifications/:id/reject
export const rejectOwnerVerification=async(req,res)=>{
    try{
        const verification=await ownerVerification.findById(req.params.id);
        if(!verification){
            return res.status(404).json({
                success:false,
                message:"Verification request not found"
            })
        }
        if(verification.status=="rejected"){
            return res.status(400).json({
                success:false,
                message:"Verification request already rejected"
            })
        }
        verification.status="rejected";
        verification.rejectionReason=req.body.rejectionReason;
        verification.reviewedBy=req.user._id;
        verification.reviewedAt=Date.now();
        await verification.save();
        return res.status(200).json({
            message:"rejected the owner successfully"
        })
           
    }
    catch(error){
        return res.status(500).json({
            message:"Internal Server Error",
            error:error.message
        });
    }
}
// ==========================================
// Get All Approved Owners
// GET /api/admin/owners
// ==========================================
export const getApprovedOwners = async (req, res) => {
    try {

        const approvedOwners = await OwnerVerification.find({
            status: "approved"
        }).populate("user", "name email phone");

        return res.status(200).json({
            success: true,
            count: approvedOwners.length,
            approvedOwners
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};
