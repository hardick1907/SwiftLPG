import {create} from 'zustand'
import {axiosInstance} from '../lib/axios.js'
import {toast} from 'react-toastify';

const BASE_URL = import.meta.env.MODE === "development"? "http://localhost:3000":"/";

export const useAuthStore = create((set) => ({

  user: null,
  admin: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isloading: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/customer/checkAuth");
      set({user: res.data})
    } catch (error) {
      console.log("Error in checkAuth:", error.message);
      set({user: null});
    } finally {
      set({isCheckingAuth: false})
    }
  },

  checkAdminAuth: async () => {
    try {
      const storedAdmin = JSON.parse(localStorage.getItem("admin"));
      if (storedAdmin) {
        set({admin: storedAdmin});
      }
      const res = await axiosInstance.get("/admin/checkadminauth");
      set({admin: res.data});
      localStorage.setItem("admin", JSON.stringify(res.data));
    } catch (error) {
      set({admin: null});
      localStorage.removeItem("admin");
    } finally {
      set({
        isCheckingAuth: false
      });
    }
  },

  customerSignup: async (data) => {
    set({isSigningUp: true});
    try {
      const res = await axiosInstance.post('/customer/signup', data);
      set({user: res.data});
      toast.success('Account created successfully');
    } catch (error) {
      if (error.response?.data?.message?.includes("Email already exists")) {
        toast.error("Email already exists");
      } else {
        toast.error("Failed to create account");
      }
    } finally {
      set({isSigningUp: false});
    }
  },

  customerLogin: async (data) => {
    set({isLoggingIn: true});
    try {
      const res = await axiosInstance.post("/customer/login", data);
      if (res && res.data) {
        set({user: res.data});
        toast.success("Login successful");
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({isLoggingIn: false});
    }
  },

  adminLogin: async (data) => {
    set({isLoggingIn: true});
    try {
      const res = await axiosInstance.post("/admin/adminlogin", data);
      if (res && res.data) {
        set({admin: res.data});
        toast.success("Login successful");
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({isLoggingIn: false});
    }
  },

  logout: async () => {
    set({isloading: true});
    try {
      await axiosInstance.get("/customer/logout");
      set({user: null});
      toast.success("Logout successful");
    } catch (error) {
      toast.error(error.response.data.message);
    }finally {
      set({isloading: false});
    }
  },
  adminLogout: async () => {
    set({isloading: true});
    try {
      await axiosInstance.get("/admin/adminlogout");
      set({
        admin: null
      });
      toast.success("Logout successful");
    } catch (error) {
      toast.error(error.response.data.message);
    }finally {
      set({isloading: false});
    }
  },
  
}));