import { motion } from "framer-motion";
import Input from "../components/Input";
import { User, Mail, Lock, Loader, SquareUser } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const { signup, error, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSignUp = async e => {
    e.preventDefault();
    try {
      await signup(email, password, userName, name);
      navigate("/verify-email");
    } catch (error) {
      console.log("Error al registrarse", error);
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
        {/* Titulo */}
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-sky-500 text-transparent bg-clip-text">
          Registrarse
        </h2>

        {/* El formulario para ingresar los datos de mail, contraseña y username */}
        <form onSubmit={handleSignUp}>
          <Input
            icon={SquareUser}
            type="text"
            placeholder="Nombre Completo"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Input
            icon={User}
            type="text"
            placeholder="Nombre de Usuario"
            value={userName}
            onChange={e => setUserName(e.target.value)}
          />
          <Input
            icon={Mail}
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {/* Mensajes de error */}
          {error && (
            <p className="text-red-500 font-semibold mt-2">{error}</p>
          )}

          {/* Medidor de la calidad de la contraseña */}
          <PasswordStrengthMeter password={password} />

          {/* Boton de "Registrarme" */}
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-sky-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-blue-600	hover:to-sky-700 focus:outline-none focus:ring-2
             focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {/* Muestra la animacion de cargando si isLoading = true o muestra el texto */}
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={24} />
            ) : (
              "Registrarme"
            )}
          </motion.button>
        </form>
      </div>

      {/* Seccion para ir a la pagina de iniciar sesión */}
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to={"/login"}
            className="text-blue-400 hover:underline"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </motion.div>
  );
};
export default SignUpPage;
