import express from "express";
import { BookCylinder, BookingHistory, CheckAuth, GetNotices, Login, Logout, SignUp } from "../controller/customer.controller.js";
import { customerProtectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup",SignUp)
router.post("/login",Login);
router.get("/checkauth",customerProtectRoute,CheckAuth)
router.get("/notices", customerProtectRoute, GetNotices);
router.post("/bookcylinder",customerProtectRoute,BookCylinder);
router.get("/bookinghistory", customerProtectRoute, BookingHistory);
router.get("/logout",Logout);

export default router;