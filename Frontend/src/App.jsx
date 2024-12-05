import{ useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Home from './Pages/Home.jsx'
import { Navigate, Route, Routes } from 'react-router-dom'
import CustomerSignUp from './components/Customer/CustomerSignUp.jsx'
import Notifications from './components/Notifications.jsx'
import { useAuthStore } from './Store/useAuthStore.js'
import Dashboard from './components/Customer/Dashboard.jsx'
import { Loader } from 'lucide-react'
import CustomerLogIn from './components/Customer/CustomerLogIn.jsx'
import AdminLogIn from './components/Admin/AdminLogin.jsx'
import AdminDashboard from './components/Admin/AdminDashboard.jsx'
import ManageUsers from './components/Admin/ManageUsers.jsx'
import Notices from './components/Admin/Notices.jsx'
import BookingCylinder from './components/Customer/BookCylinder.jsx' 
import EditCustomer from './Pages/EditCustomer.jsx'
import Inbox from './components/Customer/Inbox.jsx'
import BookingHistory from './components/Customer/BookingHistory.jsx'
import Request from './components/Admin/Request.jsx'
import SignIn from './Pages/Signin.jsx'

export default function App () {

  const {user,checkAuth,isCheckingAuth,admin,checkAdminAuth} = useAuthStore()

  useEffect(() => {
    checkAuth();
    checkAdminAuth();
  }, [checkAuth,checkAdminAuth]);


  if (isCheckingAuth){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Navbar/>
      <Routes>
          <Route path='/' element={<Home/>}/>
          
          <Route path="/signin" element={!user ? <SignIn/> : <Navigate to="/dashboard" />}/>
          <Route path="/customersignup" element={!user ? <CustomerSignUp/> : <Navigate to="/dashboard" />}/>
          <Route path="/customerlogin" element={!user ? <CustomerLogIn/> : <Navigate to="/dashboard" />}/>
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/signin" />} />
          <Route path="/booknow" element={user ? <BookingCylinder/> : <Navigate to="/signin" />} />
          <Route path="/customerinbox" element={user ? <Inbox/> : <Navigate to="/signin" />} />
          <Route path="/bookinghistory" element={user ?<BookingHistory/> : <Navigate to="/signin" />} />


          <Route path="/adminlogin" element={!admin ? <AdminLogIn/> : <Navigate to="/admindashboard"/>}/>
          <Route path="/admindashboard" element={admin? <AdminDashboard/> : <Navigate to="/adminlogin"/>}/>
          <Route path="/manageusers" element = {admin? <ManageUsers/>: <Navigate to="/adminlogin"/>}/>
          <Route path="/notices" element = {admin? <Notices/>: <Navigate to="/adminlogin"/>}/>
          <Route path="/editcustomer/:customerId" element = {admin? <EditCustomer/>: <Navigate to="/adminlogin"/>}/>
          <Route path="/bookingsrequest" element = {admin? <Request/>: <Navigate to="/adminlogin"/>}/>

      </Routes>
      <Notifications/>
    </div>
     
  )
}

