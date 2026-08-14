import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";
 //creating the booking by validating the vehicle availability
 export const createBooking=async(req,res)=>{
    try{
        const {
            vehicleId,
            startDate,
            endDate
        }=req.body;
        if(!vehicleId || !startDate || !endDate){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }
            //converting string into date format
            const start=new Date(startDate);
            const end=new Date(endDate);
            if(Number.isNaN(start.getTime())|| Number.isNaN(end.getTime())){
                return res.status(400).json({
                    sucess:false,
                    message:"Invalid date format"
                });
            }
            if(start>=end){
                return res.status(400).json({
                    sucess:false,
                    message:"Start date must be before end date"
                });
            }
            //checking that start date is not past
            const today=new Date();
            today.setHours(0,0,0,0);
            if(start<today){
                return res.status(400).json({
                    sucess:false,
                    message:"start date canot be past date"
                })
            }
            const vehicle=await Vehicle.findById({
                id:vehicleId,
                status:"approved"
            });
            if(!vehicle){
                return res.status(404).json({
                    success:false,
                    message:"Vehicle not found"
                });
            }
        
            // checking that coustomer is not booking his own vehicle
            if(vehicle.owner.toString()===req.user._id.toString()){
                return res.status(400).json({
                    success:false,
                    message:"You cannot book your own vehicle"
                });
            }
            //checking that booking overlap by vehicle that vehicle is allready booked 
           // for given range of dates
           const exisistingBooking=await Booking.findOne({
                vehicle:vehicleId,
                status:{$in:["pending","confirmed"]},
                startDate:{
                        $lt:end
                },
                endDate:{   
                    $gt:start
                }
           });
           if(exsistingBooking){ 
                return res.status(400).json({
                    success:false,
                    message:"the vehicle is booked during that time"
                })
           }
           const milliSecondsPerDay=1000*60*60*24;
           const totalDays=Math.ceil((end-start)/milliSecondsPerDay);
           const totalAmount=totalDays*vehicle.pricePerDay;
           //creating the booking
           const booking=await Booking.create({
                coustomer:req.user._id,
                owner:vehicle.owner,
                vehicle:vehicle._id,
                startDate:start,
                endDate:end,
                totalDays,
                pricePerDay:vehicle.pricePerDay,
                totaolAmount,
                status:"pending"
           });
           const populatedBooking=Booking.findById(
                booking._id,
           ).populate("coustomer","name email phone")
           .populate("owner","name email phone")
           .populate("vehicle","name brand model category location pricePerday images");
           return res.status(200).json({
            success:true,
            message:"vehicle booking ceated successfully",
            booking:populatedBooking

           });
           
    }catch(error){
        return res.status(500).json({
            message:"Internal server error",
            error:error.message
        })
    }
 }