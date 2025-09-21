import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = `${import.meta.env.VITE_BASE_API_URL}/portfolio`;
axios.defaults.withCredentials = true;

export const usePortfolioStore = create(set => ({
  aboutMeSection: null,
  certificateSection: null,
  contactSection: null,
  educationSection: null,
  experienceSection: null,
  presentationSection: null,
  projectSection: null,
  technologySection: null,
  isLoading: false,
  error: null,

  fetchSection: async (userName, sectionName, endpoint) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/${userName}${endpoint}`);
      set({
        [sectionName]: response.data[sectionName],
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error obteniendo la presentación"
      });
    } finally {
      set({
        isLoading: false
      })
    }
  },

  editSection: async (userName, section, data, endpoint, image) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append(section, JSON.stringify(data));

      if (image instanceof File) {
        formData.append('image', image);
      }

      await axios.put(`${API_URL}/${userName}/${endpoint}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      set({
        data
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || `Error editando ${section}`
      });
    } finally {
      set({
        isLoading: false
      });
    }
  },

  editItem: async (userName, sectionId, endpointPath, editedData, sectionName, objectName) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append(sectionName, JSON.stringify({ [objectName]: editedData }));

      if (editedData.image instanceof File) {
        formData.append('image', editedData.image);
      }

      await axios.put(
        `${API_URL}/${userName}${endpointPath}/${sectionId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    } catch (error) {
      set({
        error: error.response?.data?.message || `Error editando ${sectionName}`
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (userName, endpointPath, itemData, sectionName, objectName) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append(sectionName, JSON.stringify({ [objectName]: itemData }));

      if (itemData.image instanceof File) {
        formData.append('image', itemData.image);
      }

      await axios.post(`${API_URL}/${userName}${endpointPath}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || `Error agregando item ${sectionName}`
      });
    } finally {
      set({ isLoading: false })
    }
  },

  deleteItem: async (userName, itemId, endpointPath, sectionName, objectName) => {
    try {
      await axios.delete(`${API_URL}/${userName}${endpointPath}/${itemId}`);
      set(state => ({
        [sectionName]: {
          ...state[sectionName],
          [objectName]: state[sectionName][objectName].filter(item => item._id !== itemId)
        }
      }));
    } catch (error) {
      console.error(`Error al eliminar el item de ${sectionName}`, error);
    }
  },

  //* Funciones para ContactSection
  sendContactMessage: async (userName, formData, userEmail) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/${userName}/send-email`, {
        formData,
        userEmail,
      });
      set(state => ({ isLoading: false }));
      toast.success("Mensaje enviado correctamente");
    } catch (error) {
      toast.error("Lo lamento! No he podido enviar el email");
      console.error("Error al enviar el mensaje:", error.message);
      set({ error: error.message });
    }
  },

}));