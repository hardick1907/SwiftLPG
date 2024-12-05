import bcrypt from "bcrypt";
import {generateToken} from "../lib/utils.js";
import { db } from "../lib/db.js";
import { realdb } from "../lib/db.js";
import { collection, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import {ref,push,set, onValue,update, get} from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { transporter } from "../lib/email.js";
import { AdminLogger } from "../lib/winston.js";

export const Login = async (req, res) => {
  try {
    const {
      email,
      adminId,
      password
    } = req.body;

    if (!email || !password || !adminId) {
      AdminLogger.error('Login attempt with missing fields');
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const customersCollection = collection(db, "admin");
    const adminQuery = query(customersCollection, where("email", "==", email), where("adminId", "==", adminId));
    const querySnapshot = await getDocs(adminQuery);

    if (querySnapshot.empty) {
      AdminLogger.error(`Login attempt failed: Invalid credentials for email ${email}`);
      return res.status(404).json({
        message: "Invalid credentials"
      });
    }

    const user = querySnapshot.docs[0].data();;

    if (!user) {
      AdminLogger.error(`Login attempt failed: No user found for email ${email}`);
      return res.status(404).json({
        message: "Invalid credentials"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      AdminLogger.error(`Login attempt failed: Invalid password for email ${email}`);
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = generateToken(adminId, res);
    AdminLogger.info(`Successful login for admin with ID: ${adminId}`);
    res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (error) {
    AdminLogger.error(`Error in login controller: ${error.message}`);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const FetchCustomers = async (req, res) => {
  try {
    const customersCollection = collection(db, "customers");
    const querySnapshot = await getDocs(customersCollection);
    const customers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    AdminLogger.info(`Fetched ${customers.length} customers`);
    res.status(200).json(customers);
  } catch (error) {
    AdminLogger.error(`Error in fetchCustomers controller: ${error.message}`);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const CustomerDetails = async (req, res) => {
  try {
    const customerId = req.params.id;

    const customerDoc = doc(db, "customers", customerId);
    const customerSnapshot = await getDoc(customerDoc);

    if (!customerSnapshot.exists()) {
      AdminLogger.error(`Attempt to fetch details for non-existent customer: ${customerId}`);
      res.status(404).json({
        message: "Customer not found"
      });
      return;
    }

    const customer = customerSnapshot.data();
    delete customer.password;
    AdminLogger.info(`Retrieved details for customer: ${customerId}`);
    res.status(200).json(customer);
  } catch (error) {
    AdminLogger.error(`Error in customerDetails controller: ${error.message}`);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const UpdateCustomer = async (req, res) => {
  try {
    const {
      connectionId,
      name,
      email,
      phoneNumber,
      address
    } = req.body;
    const {
      customerId
    } = req.params;

    if (!connectionId) {
      AdminLogger.error('Update customer failed: Missing connection ID');
      return res.status(400).json({
        message: "Connection ID is required"
      });
    }

    if (!name || name.trim() === '') {
      AdminLogger.error('Update customer failed: Missing name');
      return res.status(400).json({
        message: "Name is required"
      });
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      AdminLogger.error('Update customer failed: Invalid email format');
      return res.status(400).json({
        message: "Invalid email format"
      });
    }

    if (!phoneNumber || !/^[6-9][0-9]{9}$/.test(phoneNumber)) {
      AdminLogger.error('Update customer failed: Invalid phone number');
      return res.status(400).json({
        message: "Invalid phone number"
      });
    }

    if (!address || address.trim() === '') {
      AdminLogger.error('Update customer failed: Missing address');
      return res.status(400).json({
        message: "Address is required"
      });
    }

    const customerDocRef = doc(db, "customers", customerId);

    const customerSnapshot = await getDoc(customerDocRef);
    if (!customerSnapshot.exists()) {
      AdminLogger.error(`Update failed: Customer not found - ${customerId}`);
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    const customersCollection = collection(db, "customers");
    const emailQuery = query(customersCollection, where("email", "==", email));
    const emailQuerySnapshot = await getDocs(emailQuery);

    const existingCustomersWithEmail = emailQuerySnapshot.docs.filter(
      (docSnapshot) => docSnapshot.id !== customerId
    );

    if (existingCustomersWithEmail.length > 0) {
      AdminLogger.error(`Update failed: Email already in use - ${email}`);
      return res.status(400).json({
        message: "Email already in use by another customer"
      });
    }

    await updateDoc(customerDocRef, {
      connectionId,
      name: name.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      address: address.trim(),
    });

    const updatedCustomerSnapshot = await getDoc(customerDocRef);
    const updatedCustomer = {
      id: updatedCustomerSnapshot.id,
      ...updatedCustomerSnapshot.data()
    };
    delete updatedCustomer.password;

    AdminLogger.info(`Customer updated successfully: ${customerId}`);
    return res.status(200).json({
      message: "Customer updated successfully",
      customer: updatedCustomer
    });
  } catch (error) {
    AdminLogger.error(`Error updating customer: ${error.message}`);
    return res.status(500).json({
      message: "Failed to update customer",
      error: error.message
    });
  }
};

export const DeleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const customerDocRef = doc(db, "customers", customerId);

    const customerSnapshot = await getDoc(customerDocRef);
    if (!customerSnapshot.exists()) {
      AdminLogger.error(`Delete failed: Customer not found - ${customerId}`);
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    await deleteDoc(customerDocRef);

    AdminLogger.info(`Customer deleted successfully: ${customerId}`);
    res.status(200).json({
      message: "Customer deleted successfully"
    });
  } catch (error) {
    AdminLogger.error(`Error deleting customer: ${error.message}`);
    return res.status(500).json({
      message: "Failed to delete customer",
      error: error.message
    });
  }
};

export const SendNotice = async (req, res) => {
  try {
    const {
      title,
      content
    } = req.body;
    const senderId = req.user?.id;

    if (!title || !content || !senderId) {
      AdminLogger.error('Send notice failed: Missing required fields');
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const noticesRef = ref(realdb, "notices");

    const newNoticeRef = push(noticesRef);
    const notice = {
      id: newNoticeRef.key,
      title,
      content,
      senderId,
      createdAt: Date.now(),
    };

    await set(newNoticeRef, notice);

    AdminLogger.info(`Notice created successfully by sender: ${senderId}`);
    res.status(201).json({
      message: "Notice created successfully",
      notice
    });
  } catch (error) {
    AdminLogger.error(`Error creating notice: ${error.message}`);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const GetNoticesAdmin = (req, res) => {
  try {
    const noticesRef = ref(realdb, "notices");

    onValue(noticesRef, (snapshot) => {
      const notices = [];
      snapshot.forEach((childSnapshot) => {
        const notice = childSnapshot.val();
        notices.push(notice);
      });

      if (!res.headersSent) {
        AdminLogger.info(`Retrieved ${notices.length} notices`);
        res.status(200).json(notices);
      }
    }, (error) => {
      AdminLogger.error(`Error fetching notices: ${error.message}`);
      if (!res.headersSent) {
        res.status(500).json({
          message: "Internal server error"
        });
      }
    });
  } catch (error) {
    AdminLogger.error(`Error fetching notices: ${error.message}`);
    if (!res.headersSent) {
      res.status(500).json({
        message: "Internal server error"
      });
    }
  }
};

export const BookingsRequest = async (req, res) => {
  try {
    const bookingRef = ref(realdb, "bookings");

    const bookingsPromise = new Promise((resolve, reject) => {
      onValue(bookingRef, (snapshot) => {
        const bookings = [];
        snapshot.forEach((childSnapshot) => {
          const booking = childSnapshot.val();
          bookings.push(booking);
        });

        resolve(bookings);
      }, (error) => {
        reject(error);
      });
    });

    const bookings = await bookingsPromise;
    AdminLogger.info(`Retrieved ${bookings.length} booking requests`);
    res.status(200).json(bookings);

  } catch (error) {
    AdminLogger.error(`Error fetching bookings: ${error.message}`);
    res.status(500).json({
      message: "Error fetching bookings"
    });
  }
};

export const AcceptRequest = async (req, res) => {
  try {
    const {
      connectionId
    } = req.params;
    const {
      email,
      name,
      transactionId,
      deliveryDate
    } = req.body;
    AdminLogger.info(`Processing booking acceptance for connection ID: ${connectionId}`);

    const bookingRef = ref(realdb, "bookings");

    const bookingSnapshot = await get(bookingRef);

    if (bookingSnapshot.exists()) {
      const bookingsData = bookingSnapshot.val();
      const bookingKeys = Object.keys(bookingsData);

      for (const key of bookingKeys) {
        if (bookingsData[key].connectionId === connectionId) {
          if (bookingsData[key].status !== "Pending") {
            AdminLogger.warn(`Booking status already updated for connection ID: ${connectionId}`);
            return res.status(400).json({
              message: "Booking status already updated"
            });
          }

          const bookingId = `BOOK-${Date.now()}-${uuidv4().split("-")[0].toUpperCase()}`;
          const updatedBooking = {
            ...bookingsData[key],
            status: "Accepted",
            bookingId: bookingId,
          };

          await update(ref(realdb, `bookings/${key}`), updatedBooking);

          const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Booking Request Accepted",
            html: `
              <p>Dear ${name}!</p>
              <p>We are pleased to inform you that your booking request has been successfully accepted.</p>

              <h3>Booking Details:</h3>
              <ul>
                  <li><strong>Booking ID:</strong> ${bookingId}</li>
                  <li><strong>Connection ID:</strong> ${connectionId}</li>
                  <li><strong>Transaction ID:</strong> ${transactionId}</li>
                  <li><strong>Delivery Date:</strong> ${deliveryDate}</li>
              </ul>

              <p>Your booking will be processed, and we will ensure timely delivery. If
              you have any questions or need further assistance, please feel free to contact us.</p>

              <p>Warm regards,</p>
              <p>The SwiftLPG Team</p>

              <p>Contact Us: <a href="mailto:swiftlpggas@gmail.com">swiftlpggas@gmail.com</a></p>
            `,
          };

          try {
            await new Promise((resolve, reject) => {
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  AdminLogger.error(`Error sending acceptance email: ${error.message}`);
                  reject(error);
                } else {
                  AdminLogger.info(`Acceptance email sent to ${email}`);
                  resolve(info);
                }
              });
            });
          } catch (emailError) {
            AdminLogger.error(`Failed to send acceptance email: ${emailError.message}`);
          }

          AdminLogger.info(`Booking accepted for connection ID: ${connectionId}`);
          return res.status(200).json({
            message: "Booking accepted successfully"
          });
        }
      }

      AdminLogger.warn(`No booking found for connection ID: ${connectionId}`);
      return res.status(404).json({
        message: "Booking not found"
      });
    } else {
      return res.status(404).json({
        message: "No bookings exist"
      });
    }
  } catch (error) {
    AdminLogger.error(`Error accepting booking: ${error.message}`);
    return res.status(500).json({
      message: "Error accepting booking"
    });
  }
};

export const DenyRequest = async (req, res) => {
  try {
    const {
      connectionId
    } = req.params; 
    const {
      email,
      name
    } = req.body;
    AdminLogger.info(`Processing booking acceptance for connection ID: ${connectionId}`);

    const bookingRef = ref(realdb, "bookings");

    const bookingSnapshot = await get(bookingRef);

    if (bookingSnapshot.exists()) {
      const bookingsData = bookingSnapshot.val();
      const bookingKeys = Object.keys(bookingsData);

      for (const key of bookingKeys) {
        if (bookingsData[key].connectionId === connectionId) {
          if (bookingsData[key].status !== "Pending") {
            return res.status(400).json({
              message: "Booking status already updated"
            });
          }

          const bookingId = `BOOK-${Date.now()}-${uuidv4().split("-")[0].toUpperCase()}`;
          const updatedBooking = {
            ...bookingsData[key],
            status: "Accepted",
            bookingId: bookingId,
          };

          await update(ref(realdb, `bookings/${key}`), updatedBooking);

          const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Booking Request Denied",
            html: `
              <p>Dear ${name}!</p>
              <p>We regret to inform you that your booking request has been denied.</p>

              <p>Thank you for your understanding.</p>

              <p>Warm regards,</p>
              <p>The SwiftLPG Team</p>

              <p>Contact Us: <a href="mailto:swiftlpggas@gmail.com">swiftlpggas@gmail.com</a></p>
            `,
          };

          try {
            await new Promise((resolve, reject) => {
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  AdminLogger.error(`Error sending email: ${error.message}`);
                  reject(error);
                } else {
                  AdminLogger.info(`Email sent to ${email}`);
                  resolve(info);
                }
              });
            });
          } catch (emailError) {
            AdminLogger.error(`Failed to send email: ${emailError.message}`);
          }

          return res.status(200).json({
            message: "Booking denied"
          });
        }
      }
    }
  } catch (error) {
    AdminLogger.error(`Error denying booking: ${error.message}`);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }

}

export const AdminLogout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    AdminLogger.info("Admin logout successful");
    res.status(200).json({
      message: "Admin logout successful"
    });
  } catch (error) {
    AdminLogger.error(`Error in adminLogout controller: ${error.message}`);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const CheckAdminAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
    AdminLogger.info("Admin authenticated");
  } catch (error) {
    AdminLogger.error(`Error in checkAdminAuth controller: ${error.message}`);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}