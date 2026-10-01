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
            const vehicle=await Vehicle.findOne({
                _id:vehicleId,
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
           if(exisistingBooking){ 
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
             customer:req.user._id,
                owner:vehicle.owner,
                vehicle:vehicle._id,
                startDate:start,
                endDate:end,
                totalDays,
                pricePerDay:vehicle.pricePerDay,
                 totalAmount,
                status:"pending"
           });
             const populatedBooking=await Booking.findById(
                booking._id,
                     ).populate("customer","name email phone")
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



// ==========================================
// GET MY BOOKINGS
// GET /api/bookings/my
// Customer only
// ==========================================
export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            customer: req.user._id
        })
            .populate(
                "vehicle",
                "name brand model category catagory location pricePerDay images"
            )
            .populate(
                "owner",
                "name email phone"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error("Get my bookings error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



// ==========================================
// GET BOOKING BY ID
// GET /api/bookings/:id
// Customer OR Owner
// ==========================================
export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(
            req.params.id
        )
            .populate(
                "customer",
                "name email phone"
            )
            .populate(
                "owner",
                "name email phone"
            )
            .populate(
                "vehicle",
                "name brand model category catagory location pricePerDay images"
            );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        const userId = req.user._id.toString();
  const customerId =
            booking.customer._id.toString();

        const ownerId =
            booking.owner._id.toString();

        const isCustomer =
            userId === customerId;

        const isOwner =
            userId === ownerId;

        if (!isCustomer && !isOwner) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to view this booking"
            });
        }

        return res.status(200).json({
            success: true,
            booking
        });

    } catch (error) {
        console.error("Get booking by id error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



  

// ==========================================
// CANCEL BOOKING
// PUT /api/bookings/:id/cancel
// Customer only
// ==========================================
export const cancelBooking = async (req, res) => {
    try {
        const {
            cancellationReason
        } = req.body;

        const booking = await Booking.findOne({
            _id: req.params.id,
            customer: req.user._id
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // Only pending or confirmed can be cancelled
        if (
            booking.status !== "pending" &&
            booking.status !== "confirmed"
        ) {  return res.status(400).json({
                success: false,
                message: "This booking cannot be cancelled"
            });
        }

        booking.status = "cancelled";
        booking.cancelledBy = req.user._id;
        booking.cancellationReason =
            cancellationReason ||
            "Cancelled by customer";

        await booking.save();

        return res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            booking
        });

    } catch (error) {
        console.error("Cancel booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};





// ==========================================
// GET OWNER BOOKING REQUESTS
// GET /api/bookings/owner/requests
// Owner only
// ==========================================
export const getOwnerBookingRequests = async (req, res) => {
    try {
        const bookings = await Booking.find({
            owner: req.user._id
        })
            .populate(
                "customer",
                "name email phone"
            )
            .populate(
                "vehicle",
                "name brand model category catagory location pricePerDay images"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error(
            "Get owner booking requests error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
  //update booking status
  //put/api/bookings/:id/status
  export const updateBookingStatus=async(req,res)=>{
    try{
                const { status } = req.body;
        const allowedStatuses=["confirmed","completed","rejected"];
        if(!allowedStatuses.includes(status)){
            return res.status(400).json({
                success:false,
                message:"Invalid booking status"
            });
        }
        const booking=await Booking.findOne({
            _id:req.params.id,
            owner:req.user._id
        });
        if(!booking){
            return res.status(404).json({
                success:false,
                message:"Booking is not available"
            });
        }

        //changing the pending one into confirmed/rejected
        if(booking.status=="pending" && (status=="confirmed" || status=="rejected")){
            booking.status=status;
        }
        else if(booking.status=="confirmed" && status=="completed"){
            booking.status=status;
        }
        else{
             return res.status(400).json({
                success: false,
                message:
                    `Cannot change booking status from ${booking.status} to ${status}`
            });
        }
        await booking.save();
        return res.status(200).json({
            success:true,
            message:"Booking status updated successfully",
            booking
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
  }