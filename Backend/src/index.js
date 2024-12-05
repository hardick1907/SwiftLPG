import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import customerRoute from './routes/customer.route.js';
import adminRoute from './routes/admin.route.js';
import { setupCylinderAllocationCronJob } from './lib/cron.js';
import path from 'path';

dotenv.config();
const app = express();
const PORT = process.env.PORT
const __dirname = path.resolve();

app.use(express.json());
app.use(cors({origin: "http://localhost:5173",credentials: true,}));
app.use(cookieParser());
setupCylinderAllocationCronJob();

app.use("/api/customer",customerRoute);
app.use("/api/admin",adminRoute);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../Frontend/dist")));
    app.get("*",(req,res) => {
        res.sendFile(path.resolve(__dirname,"../Frontend","dist","index.html"));
    })
}
  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
