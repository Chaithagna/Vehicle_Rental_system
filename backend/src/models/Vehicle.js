import mongoose from "mongoose";
const vehicleSchema=new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    brand:{
        type:String,
        required:true,
        trim:true,
    },
    model:{
        type:String,
        required:true,
        trim:true
    },
    catagory:{
        type:String,
        enum:[
            "luxury car",
            "sports bike",
            "sedan",
            "SUV",
            "electric vehicle",
            "scooter",

        ],
        required:true,
    },
    location:{
        type:String,
        required:true,
        trim:true
    },
    state:{
        type:String,
        required:true,
        trim:true
    },
    pricePerDay:{
        type:Number,
        required:true,
    },
     fuelType: {
      type: String,
      enum: ["petrol", "diesel", "electric", "hybrid"],
      required: true,
    },
    seatingCapacity: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ], 

    description: {
      type: String,
    },

    features: [
      {
        type: String,
      },
    ],

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "suspended",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;
