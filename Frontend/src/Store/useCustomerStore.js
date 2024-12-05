import {create} from 'zustand'
import {axiosInstance} from '../lib/axios.js'
import {toast} from 'react-toastify';

export const useCustomerStore = create((set) => ({

  notices: [],
  isloading: false,

  fetchNotices: async () => {
    set({isLoading: true});
    try {
      const res = await axiosInstance.get("/customer/notices");
      set({notices: res.data,isLoading: false});
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch notices");
    }finally {
      set({isLoading: false});
    }
  },

  bookCylinder: async (formData) => {
    set({isloading: true});
    try {
      const res = await axiosInstance.post("/customer/bookcylinder", formData);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to book cylinder");
    } finally {
      set({isloading: false});
    }
  },

  fetchBookingHistory: async () => {
    set({isloading: true});
    try {
      const res = await axiosInstance.get("/customer/bookinghistory");
      set({bookings: res.data,isloading: false
      });
    } catch (error) {
      set({isloading: false});
      toast.error(error.response?.data?.message || "Failed to fetch booking history");
    }
  },

}));