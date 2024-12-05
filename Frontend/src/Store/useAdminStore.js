import {create} from 'zustand'
import {axiosInstance} from '../lib/axios.js'
import {toast} from 'react-toastify';

export const useAdminStore = create((set) => ({

  customers: [],
  noticesAdmin: [],
  bookings: [],
  isloading: false,

  fetchCustomers: async () => {
    set({isloading: true});
    try {
      const res = await axiosInstance.get("/admin/fetchcustomers");
      set({customers: res.data || []});
    } catch (error) {
      toast.error(error.response.data.message);
      set({customers: []});
    } finally {
      set({
        isloading: false
      });
    }
  },

  fetchCustomerDetails: async (customerId) => {
    set({isLoading: true});
    try {
      const res = await axiosInstance.get(`/admin/customerdetails/${customerId}`);
      set({details: res.data});
    } catch (error) {
      console.error("Error in fetchCustomerDetails:", error.message);
    } finally {set({isLoading: false});
    }
  },

  updateCustomer: async (customerId, formData) => {
    set({isloading: true});
    try {
      const res = await axiosInstance.put(`/admin/updatecustomer/${customerId}`, formData);
      toast.success(res.data.message);
      return res.data.customer;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update customer");
      throw error;
    } finally {
      set({isloading: false});
    }
  },

  deleteCustomer: async (customerId) => {
    try {
      const res = await axiosInstance.delete(`/admin/deletecustomer/${customerId}`);
      toast.success(res.data.message);
      set((state) => ({
        customers: state.customers.filter((customer) => customer.id !== customerId),
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete customer");
    }
  },

  sendNotice: async (noticeData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/admin/sendnotice", noticeData);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send notice");
    }finally {
      set({ isLoading: false });
    }
  },

  fetchNoticesAdmin: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/admin/getnoticesadmin");
      set({noticesAdmin: res.data,isLoading: false});
    } catch (error) {
      set({isLoading: false});
      toast.error(error.response?.data?.message || "Failed to fetch notices");
    }
  },

  bookingsRequest: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/admin/bookingsrequest");
      set({bookings: res.data});
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch bookings");
    }finally {
      set({ isLoading: false });
    }
  },

  acceptRequest: async (bookingDetails) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post(`/admin/acceptrequest/${bookingDetails.connectionId}`, bookingDetails);
      toast.success("Booking request accepted successfully");
      await useAuthStore.getState().bookingsRequest();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }finally {
      set({ isLoading: false });
    }
  },

  denyRequest: async (bookingDetails) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post(`/admin/denyrequest/${bookingDetails.connectionId}`, bookingDetails);
      toast.success("Booking request denied successfully");
      await useAuthStore.getState().bookingsRequest();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }finally {
      set({ isLoading: false });
    }
  },

}));