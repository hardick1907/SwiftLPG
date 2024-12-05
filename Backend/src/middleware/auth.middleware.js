import jwt from "jsonwebtoken";
import { db } from "../lib/db.js";
import { collection, query, where, getDocs } from "firebase/firestore";

export const customerProtectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No Token Provided"
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token expired, please log in again"
        });
      }
      return res.status(401).json({
        message: "Invalid token"
      });
    }

    const customersCollection = collection(db, "customers");
    const q = query(customersCollection, where("email", "==", decoded.userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const user = querySnapshot.docs[0].data();
    const userId = querySnapshot.docs[0].id;
    req.user = {
      ...user,
      id: userId
    };

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};



export const AdminProtectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No Token Provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const adminCollection = collection(db, "admin");
    const q = query(adminCollection, where("adminId", "==", decoded.userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const admin = querySnapshot.docs[0].data();
    const userId = querySnapshot.docs[0].id;

    req.user = {
      ...admin,
      id: userId
    };
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};