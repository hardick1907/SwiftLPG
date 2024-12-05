# SwiftLPG 🚀

  

This **Gas Agency Management System** is a robust, web-based platform designed to streamline operations for a gas agency. It provides tools for managing customer details, LPG cylinder bookings, notices, and an admin dashboard for seamless management.

  

---

  

## Features 🌟

  

### **Admin Panel**

1.  **Customer Management**:

- Add, view, update, or delete customer details.

- Track customers' LPG allocation, booking history, and profile data.

  

2.  **Booking Requests**:

- View pending booking requests.

- Approve or deny requests with a single click.

- Notify customers of request statuses via email.

  

3.  **Notice Management**:

- Publish notices visible to all customers.

- Retrieve all posted notices.

  

4.  **Logging and Security**:

- Detailed logs for admin actions using **Winston Logger**.

- JWT-based authentication ensures secure access.

  

---

  

### **Customer Panel**

1.  **Sign Up & Login**:

- Secure account creation and authentication.

  

2.  **LPG Booking**:

- Book cylinders with detailed delivery and payment options.

- Support for Paytm payments via QR codes and COD.

  

3.  **Booking History**:

- View the history of all bookings along with their statuses (Pending, Accepted, Denied).

  

4.  **Real-time Notifications**:

- Access notices published by the admin.

- Email notifications for booking statuses.

  

---

  

## Technologies Used 💻

  

### **Frontend**:

- React.js (Admin & Customer panels)

- Tailwind CSS for styling

- DOMPurify for rendering sanitized HTML content

  

### **Backend**:

- Node.js with Express.js

- Firebase Firestore and Realtime Database for data management

- JWT for secure authentication

- Node-Cron for scheduling tasks (e.g., resetting yearly cylinder quotas)

  

### **Email Service**:

-  **Nodemailer** integrated with Gmail for sending transactional emails.

  

---

  

## Project Architecture 🏗️

  

1.  **Customer Authentication**:

- Passwords are hashed with **bcrypt**.

- Tokens are generated using **JWT** and stored as secure cookies.

  

2.  **Database Structure**:

- Firestore: For structured data like customer and admin details.

- Realtime Database: For real-time updates, such as bookings and notices.

  

3.  **Cron Jobs**:

- A cron job resets yearly cylinder allocations at midnight every year.

  

4.  **Error Handling**:

- Centralized error handling with detailed logging.

  

5.  **Email Notifications**:

- Welcome emails on sign-up.

- Notifications for booking status changes.

  

---

  

## Setup Instructions 🛠️

  

### **Prerequisites**

1.  **Node.js**: Download and install [Node.js](https://nodejs.org/).

2.  **Firebase**: Set up a Firebase project and enable:

- Firestore

- Realtime Database

3.  **Environment Variables**: Create a `.env` file in the root directory:

```env
FIREBASE_APIKEY = your_firebase_api_key
FREIBASE_AUTHDOMAIN = your_firebase_auth_domain
FIREBASE_PROJECT_ID = your_firebase_project_id
FIREBASE_STORAGEBUCKET = your_firebase_storage_bucket
FIREBASE_MESSAGESENDERID = your_firebase_messaging_sender_id
FIREBASE_APPID = your_firebase_app_id
FIREBASE_URL = your_firebase_url
JWT_SECRET = your_jwt_secret
EMAIL =your_email
EMAIL_PASSWORD =your_email_password
NODE_ENV = development
PORT = 3000
```

  

### **Installation**

  

1. Clone the repository:

```bash

git clone https://github.com/hardik.1907/your-repo.git

cd your-repo

```

  

2. Install dependencies:

```bash

npm run build

```

  

3. Start the development server:

```bash

npm start

```

3. Start the client server:

```bash

cd Frontend
bun run dev

```

  

4. Open your browser and navigate to:

- Backend: `http://localhost:3000`

- Frontend: `http://localhost:5173`

  

---

  

## API Endpoints 📡

  

### **Customer API**

|Method| Endpoint | Description |
|--|--|--|
| POST |`/api/customer/signup` | Register a new customer |
| POST| `/api/customer/login` | Login as a customer |
| GET | `/api/customer/checkauth` | Verify customer authentication |
| GET | `/api/customer/notices` | Get all notices for customers |
| POST | `/api/customer/bookcylinder` | Book an LPG cylinder |
| GET | `/api/customer/bookinghistory`| View booking history |
| GET | `/api/customer/logout` | Logout customer |

  

### **Admin API**

| Method | Endpoint | Description |
|--------|-------------------------------|--------------------------------|
| POST | `/api/admin/adminlogin` | Login as an admin |
| GET | `/api/admin/checkadminauth` | Verify admin authentication |
| GET | `/api/admin/fetchcustomers` | Fetch all customer details |
| GET | `/api/admin/customerdetails/:id` | Fetch specific customer details 
| PUT | `/api/admin/updatecustomer/:customerId` | Update customer details |
| DELETE | `/api/admin/deletecustomer/:customerId` | Delete a customer |
| POST | `/api/admin/sendnotice` | Publish a notice |
| GET | `/api/admin/bookingsrequest` | View booking requests |
| POST | `/api/admin/acceptrequest/:connectionId` | Approve a booking request |
| POST | `/api/admin/denyrequest/:connectionId` | Deny a booking request |
| GET | `/api/admin/getnoticesadmin` | Get all admin notices |

  

---

  

## Testing Credentials 🧪

  

### **Admin**

-  **Email**: `admin1@gmail.com`

-  **Admin ID**: `EMPBE029E`

-  **Password**: `1234567`

  

### **Customer**

-  **Email**: `test1@gmail.com`

-  **Password**: `1234567`

  

---

  

## Live Demo 🌐

  

👉 **[View Live Demo Here](https://your-live-demo-link.com)**

  

---

  

## Screenshots 📸

  

### 1. Admin Dashboard

![Admin Dashboard](https://photos.app.goo.gl/Hi4HD7PFm74bArE59)

  

### 2. Customer Panel

![Customer Dashboard](https://photos.app.goo.gl/G4ZHHFiB8mDKT1fu7)

  

---

  

## Contribution Guidelines 🤝

  

We welcome contributions from the community! To contribute:

  

1. Fork the repository.

2. Create a new branch:

```bash

git checkout -b feature-name

```

3. Commit your changes:

```bash

git commit -m "Add feature description"

```

4. Push to your branch:

```bash

git push origin feature-name

```

5. Submit a pull request for review.

---
