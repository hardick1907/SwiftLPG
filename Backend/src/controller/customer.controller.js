import bcrypt from "bcrypt";
import {generateToken} from "../lib/utils.js";
import { db } from "../lib/db.js";
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { transporter } from '../lib/email.js';
import { ref, get,onValue,push,set } from "firebase/database";
import { realdb } from "../lib/db.js";
import { customerLogger } from "../lib/winston.js";

export const SignUp = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      phoneNumber,
      address
    } = req.body;

    if (!email || !password || !name || !phoneNumber || !address) {
      customerLogger.error(`Signup attempt with missing fields: ${JSON.stringify(req.body)}`);
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const customersCollection = collection(db, "customers");
    const q = query(customersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      customerLogger.error(`Signup attempt with existing email: ${email}`);
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const connectionId = `CONN-${Date.now()}-${uuidv4().split('-')[0].toUpperCase()}`;

    const customer = {
      email,
      password: hashedPassword,
      name,
      phoneNumber,
      address,
      connectionId,
      createdAt: new Date().toISOString(),
      cylinderAllocation: {
        total: 12,
        rate: 720,
        lastResetDate: new Date().toISOString(),
        yearlyBookedCylinders: 0
      }
    };

    await addDoc(customersCollection, customer);

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to SwiftLPG!",
      html: `
        <p>Dear ${name}!</p>
        <p>Welcome to the SwiftLPG family! We are thrilled to have you on board and look forward to 
        powering your home with safe, reliable, and efficient LPG solutions.</p>

        <h3>Your Welcome Offer</h3>
        <p>To celebrate your first year with us, enjoy an exclusive 10% discount on up to 12 cylinders
         throughout the year! It's our way of saying thank you for choosing SwiftLPG.</p>

        <h3>Your Connection ID</h3>
        <p>Your unique Connection ID is: <strong>${connectionId}</strong>. Please keep this ID safe, 
        as you will need it for all bookings and correspondence with us.</p>

        <h3>What Happens After Year One?</h3>
        <p>As a valued customer, you'll gain access to order up to 15 cylinders annually starting
         your second year, with the same reliable service you have come to expect.</p>

        <p>If you have any questions or need assistance, our support team is just a call or click
         away. Cheers to a safe and hassle-free LPG experience!</p>

        <p>Warm regards,</p>
        <p>The SwiftLPG Team</p>

        <p>Contact Us: <a href="mailto:swiftlpggas@gmail.com">swiftlpggas@gmail.com</a></p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        customerLogger.error(`Email sending failed for ${email}: ${error.message}`);
      } else {
        customerLogger.info(`Welcome email sent to ${email}`);
      }
    });

    const token = generateToken(email, res);
    customerLogger.info(`User registered successfully: ${email}`);
    res.status(200).json({
      message: "Customer registered successfully",
      token
    });
  } catch (error) {
    customerLogger.error(`Signup error: ${error.message}`);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const Login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      customerLogger.error(`Login attempt with missing credentials`);
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const customersCollection = collection(db, "customers");
    const q = query(customersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      customerLogger.error(`Login attempt with non-existent email: ${email}`);
      return res.status(404).json({
        message: "Invalid credentials"
      });
    }

    const user = querySnapshot.docs[0].data();

    if (!user) {
      customerLogger.error(`No user data found for email: ${email}`);
      return res.status(404).json({
        message: "Invalid credentials"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      customerLogger.error(`Invalid password attempt for email: ${email}`);
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = generateToken(email, res);
    customerLogger.info(`User logged in successfully: ${email}`);
    res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (error) {
    customerLogger.error(`Login error: ${error.message}`);
    res.status(500).json({
      message: "Internal server error"
    });
  }
}

export const GetNotices = (req, res) => {
  try {
    const noticesRef = ref(realdb, "notices");

    onValue(noticesRef, (snapshot) => {
      const notices = [];
      snapshot.forEach((childSnapshot) => {
        const notice = childSnapshot.val();
        notices.push(notice);
      });

      if (!res.headersSent) {
        customerLogger.info(`Fetched ${notices.length} notices`);
        res.status(200).json(notices);
      }
    }, (error) => {
      customerLogger.error(`Error fetching notices: ${error.message}`);
      if (!res.headersSent) {
        res.status(500).json({
          message: "Internal server error"
        });
      }
    });
  } catch (error) {
    customerLogger.error(`Unexpected error fetching notices: ${error.message}`);
    if (!res.headersSent) {
      res.status(500).json({
        message: "Internal server error"
      });
    }
  }
};

export const BookCylinder = async (req, res) => {
  try {
    const {
      name,
      deliveryDate,
      email,
      phoneNumber,
      address,
      paymentMethod,
      transactionId
    } = req.body;
    const customerId = req.user?.id;
    const connectionId = req.user?.connectionId;

    if (!connectionId) {
      customerLogger.error(`Booking attempt without connection ID for customer: ${customerId}`);
      return res.status(400).json({
        message: "Connection ID is missing"
      });
    }

    const requestId = `REQ-${Date.now()}-${uuidv4().split('-')[0].toUpperCase()}`;

    const bookingRef = ref(realdb, "bookings");

    const newBookingRef = push(bookingRef);
    const booking = {
      requestId,
      name,
      connectionId,
      deliveryDate,
      email,
      phoneNumber,
      address,
      customerId,
      paymentMethod,
      transactionId,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    await set(newBookingRef, booking);
    customerLogger.info(`Cylinder booking created: ${requestId} for customer ${customerId}`);
    res.status(201).json({
      message: "Booking created successfully",
      booking
    });

  } catch (error) {
    customerLogger.error(`Booking error: ${error.message}`);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const BookingHistory = async (req, res) => {
  try {
    const customerId = req.user?.id;

    if (!customerId) {
      customerLogger.error(`Booking history request without authentication`);
      return res.status(400).json({
        message: "User not authenticated"
      });
    }

    const bookingsRef = ref(realdb, "bookings");

    const snapshot = await get(bookingsRef);

    if (!snapshot.exists()) {
      customerLogger.info(`No bookings found for customer: ${customerId}`);
      return res.status(404).json({
        message: "No bookings found"
      });
    }

    const bookingsData = snapshot.val();
    const customerBookings = Object.values(bookingsData).filter(booking => booking.customerId === customerId);

    if (customerBookings.length === 0) {
      customerLogger.info(`No bookings found for customer: ${customerId}`);
      return res.status(404).json({
        message: "No bookings found for this customer"
      });
    }

    customerLogger.info(`Fetched ${customerBookings.length} bookings for customer: ${customerId}`);
    res.status(200).json(customerBookings);
  } catch (error) {
    customerLogger.error(`Booking history error: ${error.message}`);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const CheckAuth = (req, res) => {
  try {
    customerLogger.info(`Authentication check for user: ${req.user?.email}`);
    res.status(200).json(req.user);
  } catch (error) {
    customerLogger.error(`Auth check error: ${error.message}`);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

export const Logout = async (req, res) => {
  try {
    customerLogger.info(`User logged out: ${req.user?.email}`);
    res.clearCookie("jwt");
    res.status(200).json({
      message: "Logout successful"
    });
  } catch (error) {
    customerLogger.error(`Logout error: ${error.message}`);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};