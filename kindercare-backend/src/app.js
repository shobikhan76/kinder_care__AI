import express from "express"
import cors  from "cors"; 
import parentChildRoutes from "./routes/parents.child.routes.js";
import parentCaseRoutes from "./routes/parents.case.routes.js";
import parentAppointmentRoutes from "./routes/parents.appointment.routes.js";
import authRoutes from "./routes/auth.routes.js"
const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.use("/api/auth" , authRoutes)

app.use("/api/parent/children", parentChildRoutes);
app.use("/api/parent/cases", parentCaseRoutes);
app.use("/api/parent/appointments", parentAppointmentRoutes);


export default app ; 