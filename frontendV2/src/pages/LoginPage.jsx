import { useState } from "react";
import { motion } from "framer-motion";
import { Loader, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate
import Input from "../components/input";
import { useAuthStore } from "../store/authStore";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const userName = await login(email, password); // Obtén el nombre de usuario
      navigate(`/portfolio/${userName}`); // Redirige a la ruta con el nombre de usuario
    } catch (error) {
      console.error("Error iniciando sesión", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-sky-500 text-transparent bg-clip-text">
          Bienvenido
        </h2>
        <form onSubmit={handleLogin}>
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <div className="flex items-center mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-400 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          {error && (
            <p className="text-red-500 font-semibold mb-2">{error}</p>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-sky-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-sky-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Iniciar sesión"
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/signup"
            className="text-blue-400 hover:underline"
          >
            Registrarse
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default LoginPage;
