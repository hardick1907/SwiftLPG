import express from 'express';
import { AcceptRequest, AdminLogout, BookingsRequest, CheckAdminAuth, CustomerDetails, DeleteCustomer, DenyRequest, FetchCustomers, GetNoticesAdmin, Login, SendNotice, UpdateCustomer } from '../controller/admin.controller.js';
import { AdminProtectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/adminlogin",Login);
router.get("/adminlogout",AdminLogout);
router.get("/checkadminauth",AdminProtectRoute,CheckAdminAuth);
router.get("/fetchcustomers",AdminProtectRoute,FetchCustomers);
router.get("/customerdetails/:id", AdminProtectRoute,CustomerDetails);
router.put("/updatecustomer/:customerId", AdminProtectRoute, UpdateCustomer);
router.delete("/deletecustomer/:customerId", AdminProtectRoute, DeleteCustomer);
router.post("/sendnotice", AdminProtectRoute,SendNotice);
router.get("/bookingsrequest", AdminProtectRoute,BookingsRequest);
router.post("/acceptrequest/:connectionId", AdminProtectRoute, AcceptRequest);
router.post("/denyrequest/:connectionId", AdminProtectRoute, DenyRequest);
router.get("/getnoticesadmin", AdminProtectRoute,GetNoticesAdmin);

export default router;