import ownerVerification from "../models/ownerVerification.js";
//submimmintting the owner details
//post /api/owner/verify
export const submitOwnerDetails=async(req,res)=>{
    try{
        const {adhardocument,
                drivinglicence,
                selfie,
                adressproof,
                bankdetails
        }=req.body;
        if(!adhardocument || !drivinglicence || !selfie || !adressproof || !bankdetails){
            return res.status(400).json({
                sucess:false,
                message:"All fields are required"
            })
        }
        const existingVerification=await ownerVerification.findOne({userId:req.user._id});
        if(existingVerification){
            return res.status(400).json({
                sucess:false,
                message:"Owner verification already submitted"
            })
        }
         const verification = await OwnerVerification.create({
            user: req.user._id,
            aadhaarDocument,
            drivingLicense,
            selfie,
            addressProof,
            bankDetails,
            status: "pending"
        });

        return res.status(201).json({
            success: true,
            message: "Owner verification submitted successfully",
            verification
        });

    }
    catch(error){
        return res.status(500).json({
            sucess:false,
            message:"Internal Server Error"
        });
    }
        
}
//getting the  verification details
//get /api/owner/verify
export const getOwnerVerificationDetails=async(req,res)=>{
    try{
        const verification=await ownerVerification.findOne({
            userId:req.user._id
        })
        if(!verification){
            return res.status(404).json({
                sucess:false,
                message:"Verification details not found"
            })
        }
        return res.status(200).json({
            success:true,
            verification
        })
    }
    catch(error){
        return res.status(500).json({
            sucess:false,
            message:"Internal Server Error"
        });
    }
}
//updating the owner details
export const updateOwnerVerificationDetails=async(req,res)=>{
    try{
        const {adhardocument,
                drivinglicence,
                selfie,
                adressproof, 
                bankdetails
        }=req.body;
        const verification=await ownerVerification.findOne({
            userId:req.user._id
        })
        if(!verification){
            return res.status(404).json({
                sucess:false,
                message:"Verification details not found"
            })
        }
        const updatedVerification=await ownerVerification.findByIdAndUpdate(
            verification._id,
            {
                aadhaarDocument:adhardocument,
                drivingLicense:drivinglicence,
                selfie:selfie,
                addressProof:adressproof,
                bankDetails:bankdetails
            },
            {
                new:true,
                runValidators:true
            }
        )
        return res.status(200).json({
            success:true,
            verification:updatedVerification
        })
    }
    catch(error){
        return res.status(500).json({
            sucess:false,
            message:"Internal Server Error"
        });
    }
}