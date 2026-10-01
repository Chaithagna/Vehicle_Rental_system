import User from "../../models/User.js";
import Vehicle from "../../models/Vehicle.js";
import Booking from "../../models/Booking.js";
import Review from "../../models/Review.js";
import OwnerVerification from "../../models/OwnerVerification.js";
export const getDashBoardStats=async(req,res)=>{
    try{
        const[
            totalUsers,
            totalowners,
            pendingOwnerVerifcations,
            approvedOwnerVerifications,


            totalvehicles,
            pendingVehicles,
            approvedVehicles,
            rejectedVehicles,


            totalBookings,
            pendingBookings,
            confirmedBookings,
            completedBookings,
            cancelledBookings,
            rejectedBookings,

            totalReviews

        ]=await Promise.all([
            //users

            User.countDocuments(),
            User.countDocuments({roles:"owner"}),

            //owner verifications
            OwnerVerification.countDocuments({status:"pending"}),
            OwnerVerification.countDocuments({status:"approved"}),

            //vehicles
            Vehicle.countDocuments(),
            Vehicle.countDocuments({status:"pending"}),
            Vehicle.countDocuments({status:"approved"}),
            Vehicle.countDocuments({status:"rejected"}),
            

            //bookings
            Booking.countDocuments(),
            Booking.countDocuments({status:"pending"}),
            Booking.countDocuments({status:"confirmed"}),
            Booking.countDocuments({status:"completed"}),
            Booking.countDocuments({status:"cancelled"}),
            Booking.countDocuments({status:"rejected"}),   

            //Reviews
            Review.countDocuments()

        ]);
        return res.status(200).json({
            success:true,
            users:{
                total:totalUsers,
                owners:totalowners

            },
            ownerVerificationns:{
                pending:pendingOwnerVerifcations,
                approved:approvedOwnerVerifications
            },
            vehicles:{
                total:totalvehicles,
                pending:pendingVehicles,
                approved:approvedVehicles,
                rejected:rejectedVehicles
            },
            bookings:{
                total:totalBookings,
                pending:pendingBookings,
                confirmed:confirmedBookings,
                completed:completedBookings,    
                 cancelled: cancelledBookings,
                rejected: rejectedBookings
            },
            reviews:{
                totalReviews:totalReviews
            }
        });
    }
    catch(error){
        console.error("Get dashboard stats error:",error);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }

}