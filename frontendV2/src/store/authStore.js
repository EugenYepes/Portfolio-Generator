/* 
Zustand es una biblioteca de gestión de estado para aplicaciones React. 
Su propósito es manejar y compartir el estado entre diferentes componentes
Permite definir un store centralizado donde se guardan valores y funciones para manipular esos valores, 
y cualquier componente puede acceder a esos valores o funciones 
*/
import { create } from "zustand";

/*
Axios es una biblioteca de cliente HTTP que se utiliza para realizar solicitudes HTTP (como GET, POST, PUT, DELETE) desde el navegador o Node.js. 
Facilita la comunicación con APIs y servidores externos, permitiendo a tu aplicación enviar y recibir datos de manera sencilla.
Es una variante a fetch()
*/
import axios from "axios";

// Define la URL base del servidor para las solicitudes de autenticación
const API_URL = `${import.meta.env.VITE_BASE_API_URL}/auth`;

// En cada request, axios va a poner las cookies en el request
// Establecemos una configuración global para Axios que indica que todas las solicitudes hechas
// desde este cliente Axios incluirán credenciales (como cookies) en las solicitudes HTTP
axios.defaults.withCredentials = true;

export const useAuthStore = create(set => ({
  // Estado inicial del store
  user: null, // Representa al usuario actual, comienza como null
  isAuthenticated: false, // Indica si el usuario está autenticado, comienza en false
  error: null, // Almacena cualquier error que ocurra durante el proceso de autenticación
  isLoading: false, // Indica si hay una operación en curso, comienza en false
  isCheckingAuth: true, // Indica si se está verificando el estado de autenticación actual
  message: null,

  // Función para registrar un nuevo usuario
  signup: async (email, password, userName, name) => {
    // Actualiza el estado para indicar que la operación está en progreso y reinicia errores previos
    set({ isLoading: true, error: null });

    try {
      // Envía una solicitud POST al servidor para registrar un nuevo usuario
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        userName,
        name,
      });

      console.log(response.data.user)
      // Si la solicitud tiene éxito, actualiza el estado del store
      set({
        user: response.data.user, // Guarda la información del usuario recibido de la respuesta del servidor
        isLoading: false, // Indica que la operación ha terminado
      });
    } catch (error) {
      // Si la solicitud falla, captura el error y actualiza el estado del store
      set({
        error:
          error.response.data.message || "Error iniciando sesión", // Muestra el mensaje de error recibido por el backend o uno genérico
        isLoading: false, // Indica que la operación ha terminado, incluso si hubo un error
      });

      // Lanza el error para que pueda ser manejado por otros componentes si es necesario
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({
        isAuthenticated: true,
        user: response.data.user, // Guarda el objeto usuario, que incluye el nombre de usuario
        error: null,
        isLoading: false,
      });
      return response.data.user.userName; // Retorna el nombre de usuario
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ error: "Error cerrando sesion", isLoading: false });
      throw error;
    }
  },

  verifyEmail: async code => {
    // Actualiza el estado para indicar que la operación de verificación de email está en progreso
    // También restablece cualquier error anterior a null
    set({ isLoading: true, error: null });

    try {
      // Envía una solicitud POST al servidor para verificar el código de email
      // La solicitud se envía al endpoint "/verify-email" con el código proporcionado como datos
      const response = await axios.post(`${API_URL}/verify-email`, {
        code,
      });

      // Si la solicitud es exitosa, actualiza el estado del store:
      // - user: Guarda la información del usuario recibida en la respuesta
      // - isAuthenticated: Marca al usuario como autenticado
      // - isLoading: Indica que la operación ha terminado
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      // Devuelve la respuesta completa para que pueda ser utilizada por otras funciones si es necesario
      return response.data;
    } catch (error) {
      // Si hay un error durante la verificación, captura el error y actualiza el estado:
      // - error: Almacena el mensaje de error recibido desde el servidor, si existe,
      //   o muestra un mensaje genérico de error.
      // - isLoading: Indica que la operación ha terminado
      set({
        error:
          error.response.data.message ||
          "Error en la verificación del email",
        isLoading: false,
      });

      // Lanza el error para que otras partes de la aplicación puedan manejarlo si es necesario
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({
        error: null,
        isCheckingAuth: false,
        isAuthenticated: false,
      });
    }
  },

  forgotPassword: async email => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(
        `${API_URL}/forgot-password`,
        { email }
      );
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response.data.message ||
          "Error enviando el mail de reseteo de contraseña",
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/reset-password/${token}`,
        { password }
      );
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response.data.message ||
          "Error reseteando la contraseña",
      });
      throw error;
    }
  },
}));
