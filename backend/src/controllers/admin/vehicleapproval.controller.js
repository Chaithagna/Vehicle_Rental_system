import Vehicle from "../models/Vehicle.js";


//get all pending vehicles
//   get/api/admin/vehicles/pending
export const getAllPendingVehicles=async (req,res)=>{
    try{
        const vehicles=await Vehicle.find({status:"pending"})
                                    .populate("owner","name email phone")
                                    .sort({createdAt:-1});
        if(!vehicles){
            return res.status(404).json({
                message:"No pending vehicles found"
            })
        }
        return res.status(200).json({
            message:"Pending vehiles are found",
            vehicles
        })
    }
    catch(error){
        return res.status(500).json(
            {
                message:"Internal server error",
                error:error.message
            }
        )
    }
}


//get one vehicle for approval
export const  getVehicleForApproval=async(req,res)=>{
    try{
        const vehicle=Vehicle.findById(req.params.id)
                        .populate("owner","name email phone");
        if(!vehicle){
            return res.status(404).json({
                message:"vehicle not found"
            })
        }
        return status(200).json({
            success:true,
            vehicle
        })
    }
    catch(error){
        return res.status(500).json({
            message:"Internal server error",
            error:error.message
        })
    }
}



//aprove vehicle
//put/api/admin/vehicles/:id/approve
export const approveVehicle=async (req,res)=>{
    try{
        const vehicle= await Vehicle.findById(req.params.id);
        if(!vehicle){
            return res.status(404).json({
                message:"vehicle not found"
            })
        }
        if(vehicle.status=="approved"){
            return res.status(400).json({
                success:false,
                message:"vehicle already approved"
            })
        }
        vehicle.status="approved";
         vehicle.rejectionReason =null;
         await vehicle.save();
        return res.status(200).json({
            success:true,
            message:"vehicle approved successfully"
        })
    }
    catch(error){
        return res.status.json(500).json({
            message:"Internal server error",
            error:error.message
        })
    }
}

//reject vehicle
//put/api/admin/vehicle/:id/reject


export const approveVehicle=async (req,res)=>{
    try{
         const { rejectionReason } = req.body;
           if (!rejectionReason) {
            return res.status(400).json({
                success: false,
                message: "Rejection reason is required"
            });
        }
        const vehicle= await Vehicle.findById(req.params.id);
        if(!vehicle){
            return res.status(404).json({
                message:"vehicle not found"
            })
        }
        if(vehicle.status=="rejected"){
            return res.status(404).json({
                success:false,
                message:"vehicle already rejected"
            })
        }
        vehicle.status="rejected";
         vehicle.rejectionReason = rejectionReason;
         await vehicle.save();
        return res.status(200).json({
            success:true,
            message:"vehicle rejected successfully"
        })
    }
    catch(error){
        return res.status.json(500).json({
            message:"Internal server error",
            error:error.message
        })
    }
}
