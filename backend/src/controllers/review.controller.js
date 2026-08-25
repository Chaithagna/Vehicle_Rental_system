import Booking     from "../models/Booking.js";
import Vehicle     from "../models/Vehicle.js";
import Review     from "../models/Review.js";
//creating a review for booking
// post /api/reviews
//coustomer

export const createReview=async(req,res)=>{
    try{
        const {
            bookingId,
            rating,
            comment
        }=req.body;
        if(!bookingId || !rating || !comment){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        if(rating<1 || rating>5){
            return status(400).json({
                success:false,
                message:"Rating should be in between 1 and 5"
            })
        }
        const booking=await Booking.findById(bookingId);
        if(!booking){
            return res.status(404).json({
                success:false,
                message:"Booking not found"
            })
        }
        if(booking.coustomeer.toString()!==req.user._id.toString()){
            return res.status(403).json({
                success:false,
                message:"You are not authorized to review this booking"
            })
        }
        if(booking.status!=="completed"){
            return res.status(400).json({
                success:false,
                message:"You can only review completed bookings"
            })
        }
        const exsitingReview=await Review.findOne({
            coyustomer:req.user._id,
            booking:booingId
        })
        if(existingReview){
            return res.status(400).json({
                success:false,
                message:"you cannot give review already there is a review"
            })
        }
        const review=await Review.create({
            coustomer:req.user._id,
            vehicle:booking.vehicle,
            booking:booking._id,
            rating,
            comment
        });
            // 8. Update vehicle rating
        await updateVehicleRating(booking.vehicle);
        
        
                const populatedReview = await Review.findById(
            review._id
        ).populate(
            "customer",
            "name"
        );

        return res.status(201).json({
            success: true,
            message: "Review created successfully",
            review: populatedReview
        });  
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error creating review"
        })
    }
}


//get vehicle reviews
//get /api/reviews/:vehicleId
// ==========================================
export const getVehicleReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            vehicle: req.params.vehicleId
        })
            .populate("customer", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        });

    } catch (error) {
        console.error("Get vehicle reviews error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};






// ==========================================
// GET MY REVIEWS
// GET /api/reviews/my
// Customer only
// ==========================================
export const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            customer: req.user._id
        })
            .populate(
                "vehicle",
                "name brand model images"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        });

    } catch (error) {
        console.error("Get my reviews error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



// ==========================================
// UPDATE REVIEW
// PUT /api/reviews/:id
// Customer only
// ==========================================
export const updateReview = async (req, res) => {
    try {
        const {
            rating,
            comment
        } = req.body;

        // 1. Validate rating
        if (
            rating !== undefined &&
            (rating < 1 || rating > 5)
        ) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // 2. Find only review belonging to logged-in user
        const review = await Review.findOne({
            _id: req.params.id,
            customer: req.user._id
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        if (rating !== undefined) {
            review.rating = rating;
        }

        if (comment !== undefined) {
            review.comment = comment;
        }

        await review.save();

        // 3. Recalculate vehicle rating
        await updateVehicleRating(review.vehicle);

        const updatedReview = await Review.findById(
            review._id
        ).populate(
            "customer",
            "name"
        );

        return res.status(200).json({
            success: true,
            message: "Review updated successfully",
            review: updatedReview
        });

    } catch (error) {
        console.error("Update review error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// ==========================================
// DELETE REVIEW
// DELETE /api/reviews/:id
// Customer only
// ==========================================
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findOneAndDelete({
            _id: req.params.id,
            customer: req.user._id
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        // Recalculate vehicle rating
        await updateVehicleRating(review.vehicle);

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (error) {
        console.error("Delete review error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const updateVehicleRating=async(vehicleId)=>{
    const result=await Review.aggregate([
        {
            $match:{
                vehicle:vehicleId
            }
        },
        {
            $group:{
                _id:null,
                averageRating:{$avg:"$rating"},
                reviewCount:{$sum:1}
            }
        }
    ]);
    if(result.length==0){
        await Vehicle.findByIdAndUpdate(
            vehicleId,
            {
                rating:0,
                totalReviews:0
            }
        );
        return;
    }
    await vehicle.findByIdAndUpdate(
        vehicleId,
        {
            rating:Number(result[0].averageRating.toFixed(1)),
            totalReviews:result[0].reviewCount
        }
    )

}