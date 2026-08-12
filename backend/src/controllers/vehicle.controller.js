import Vehicle from '../models/Vehicle.js';
//adding the vehicle into database
//POST /api/vehicles
export const addVehicle=async (req,res)=>{
    try{
         const {
            name,
            brand,
            model,
            catagory,
            location,
            state,
            pricePerDay,
            fuelType,
            seatingCapacity,
            images,
            description,
            features
        } = req.body;
        if(!name || !brand || !model || !catagory || !location || !state || !pricePerDay || !fuelType ||  !seatingCapacity){
            return res.status(400).json({
                message:"Please fill all the required fields"
            })
        }
        const vehicle=new Vehicle({
            owner:req.user._id,
            name,
            brand,
            model,
            category:catagory.toLowerCase(),
            location,
            state,
            pricePerDay,
            fuelType,
            seatingCapacity,
            images,
            description,
            features
        });
        await Vehicle.bulkSave([vehicle]);
        return res.status(201).json({
            message:"Vehicle added successfully",
            vehicle

        });
    }
    catch(error){
        return res.status(500).json({
            message:"Internal server error",
            error:error.message
        })  
    }
}
// getting vehicle by id
//GET /api/vehicles/:id
export const getVehicleById=async(req,res)=>{
    try{
        const vehicle =await Vehicle.findById(req.params.id);
        if(!vehicle){
            return res.status(404).json({
                message:"Vehicle not found"
            })
        }
        return res.status(200).json({
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


//get my vehicles by that owner only\
//get/api/vehicles/my-vehicles
export const getMyVehicles=async(req,res)=>{
    try{
        const vehicle=await Vehicle.find({owner:req.user._id});
        if(!vehicle){
            return res.status(404).json({
                message:"Vehicles not found"
            })
        }
        return res.status(200).json({
            count:vehicle.length,
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




//getting all approved vehicles
//get/api/vehicles

export const getApprovedVehicles=async(req,res)=>{
    try{
        const vehicle=await Vehicle.find({status:"approved"});;
        if(!vehicle){
            return res.status(404).json({
                message:"Vehicles not found"
            })
        }
        return res.status(200).json({
            count:vehicle.length,
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

// ==========================================
// UPDATE VEHICLE
// PUT /api/vehicles/:id
// Owner only
// ==========================================
export const updateVehicle = async (req, res) => {
    try {

        const vehicle = await Vehicle.findOne({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found or you are not the owner"
            });
        }

        // Update the fields sent by owner
        Object.assign(vehicle, req.body);

        // After changing vehicle information,
        // send it back to admin for approval.
        vehicle.status = "pending";

        await vehicle.save();

        return res.status(200).json({
            message: "Vehicle updated and sent for admin approval",
            vehicle
        });

    } catch (error) {
        console.error("Update vehicle error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// ==========================================
// DELETE VEHICLE
// DELETE /api/vehicles/:id
// Owner only
// ==========================================
export const deleteVehicle = async (req, res) => {
    try {

        const vehicle = await Vehicle.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found or you are not the owner"
            });
        }

        return res.status(200).json({
            message: "Vehicle deleted successfully"
        });

    } catch (error) {
        console.error("Delete vehicle error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};