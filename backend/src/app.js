import express from "express";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import ownerRoutes from "./routes/owner.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import ownerVerification from "./routes/admin/ownerVerification.routes.js";
import vehicleApprovalRoutes from "./routes/admin/vehicleApproval.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import adminRoutes from "./routes/admin/admin.routes.js";
import dashboardRoutes from "./routes/admin/dashboard.routes.js";
const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);

app.use("/api/users", userRoutes);

app.use("/api/owners", ownerRoutes);

app.use("/api/vehicles", vehicleRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/admin/owners", ownerVerification);

app.use("/api/admin/vehicles", vehicleApprovalRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);
app.get("/", (req, res) => {
    res.json({
        message: "Vehicle Rental API is running"
    });
});

export default app;