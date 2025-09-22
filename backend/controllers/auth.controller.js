import bcryptjs from "bcryptjs"
import crypto from "crypto";

import Portfolio from "../models/portfolio.model.js";

import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js"
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetPasswordSuccess } from "../nodemailer/emails.js"

export const signup = async (req, res) => {
  const { email, password, userName, name } = req.body;
  try {
    //* Validaciones para asegurarse de que los campos no estén vacíos o nulos
    if(!email || !password || !userName || !name){
      throw new Error("Todos los campos son requeridos")
    }

    //* Verifica que el usuario no exista ya en la base de datos
    const userExists = await Portfolio.findOne({
      $or: [
        { 'user.email': email },
        { 'user.userName': userName }
      ]
    });

    //* Si el mail o userName ya fueron utilizados mandamos el msj para ser utilizado en el frontend
    if (userExists) {
      const message = userExists.user.email === email
        ? "El email ya está en uso."
        : "El nombre de usuario ya está en uso.";
      return res.status(400).json({ success: false, message });
    }
    
    //* Hasheamos la password del usuario -> 10 es el número de rondas que el algoritmo usará para generar el hash
    const hashedPassword = await bcryptjs.hash(password, 10);

    //* Genera el codigo de verificacion
    const verificationToken = Math.floor(100000 + Math.random() * 999999).toString();

    //* Creamos al usuario
    const newUser = {
      email,
      password: hashedPassword,
      userName,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 15 * 60 * 1000, //! Expira en 15 minutos
    };

    //* Creamos un nuevo documento Portfolio con el usuario
    const newPortfolio = new Portfolio({
      user: newUser,
      presentationSection: {
        name:{
          text: name
        }
      },
      aboutMeSection: {},
      experienceSection: {
          experiences: [{}]
      },
      educationSection: {
          educations: [{}]
      },
      certificateSection: {
          certificates: [{}]
      },
      technologySection: {
          technologies: [{}]
      },
      projectSection: {
          projects: [{}]
      },
      contactSection: {},
  });

    //* Guardamos en la base de datos
    await newPortfolio.save();

    //* Generamos un token de autenticacion y lo guardamos como una cookie
    //* Esto permite que el usuario se mantenga autenticado y pueda acceder a recursos protegidos en la aplicación.
    generateTokenAndSetCookie(res, newPortfolio.user._id);

    //* Enviamos el mail con el codigo de verificacion al usuario
    sendVerificationEmail( newPortfolio.user.email, verificationToken);
    console.log(newPortfolio.user);

    res.status(201).json({ 
      success: true, 
      message: "Usuario registrado exitosamente.",
      user: {
				...newPortfolio.user._doc,
				password: undefined,
			},
    });

  } catch (error) {
    res.status(400).json({success: false, message: error.message });
  }
}

export const verifyEmail = async (req, res) => {
  //* Obtenemos el codigo que el usuario ingresa
  const {code} = req.body;

  try {
    //* Buscamos al usuario que tenga ese codigo de verificacion y vemos si todavia es valido
    const userPortfolio = await Portfolio.findOne({
      'user.verificationToken': code,
      'user.verificationTokenExpiresAt': { $gt: Date.now() }
    })

    //* Si el usuario no se encontro o el codigo ya esta vencido
    if(!userPortfolio){
      return res.status(400).json({success: false, message:"Codigo de verificacion invalido o vencido"})
    }

    //* Cambiamos el atributo de estaVerificado a verdadero
    userPortfolio.user.isVerified = true;

    //* Eliminamos de la BD los documentos de verificationToken y verificationTokenExpiresAt por que no tiene sentido seguir guardandolas
    userPortfolio.user.verificationToken = undefined;
    userPortfolio.user.verificationTokenExpiresAt = undefined;

    //* Updateamos los valores a la BD
    await userPortfolio.save();

    //* Mandamos un mail de bienvenida al usuario
    await sendWelcomeEmail(userPortfolio.user.email, userPortfolio.user.userName);

    res.status(200).json({ 
      success: true, 
      message: "Usuario verificado exitosamente.",
      user:{
        ...userPortfolio.user._doc,
        password: undefined,
      }
    });

  } catch (error) {
    res.status(400).json({success: false, message: error.message });
  }
}

export const login = async (req, res) => {
  
  //* Obtenemos el email y contraseña del body
  const {email, password} = req.body;

  try {
    //* Buscamos el portfolio de ese usurio
    const userPortfolio = await Portfolio.findOne({ 'user.email': email });
    if(!userPortfolio){
      return res.status(400).json({ success: false, message: "Credenciales invalidas: Email"})
    }

    //* Comparamos que la contraseña del body sea la misma que la del usuario
    const isValidPassword = await bcryptjs.compare(password, userPortfolio.user.password);
    if(!isValidPassword){
      return res.status(400).json({ success: false, message: "Credenciales  invalidas: Contraseña"});
    }

    //* Si todo esta bien, creamos un token de acceso
    generateTokenAndSetCookie(res, userPortfolio.user._id);

    //* Actualizamos el campo de la ultima vez que se logeo
    userPortfolio.user.lastLogin = new Date();

    //* Guardamos en la BD
    await userPortfolio.save();

    res.status(200).json({
      success: true, 
      message: "Usuario logeado exitosamente.",
      user:{
        ...userPortfolio.user._doc,
        password: undefined,
      }
    })

  } catch (error) {
    res.status(400).json({success: false, message: error.message });
  }
}

export const logout = async (req, res) => {
  //* Eliminamos la cookie que creamos en el log in
  res.clearCookie("authToken");
  res.status(200).json({success: true, message: "Sesion cerrada exitosamente"});
}

export const forgotPassword = async (req, res) => {
  const { email, clientUrl } = req.body;
  try {
    const userPortfolio = await Portfolio.findOne({ 'user.email': email });
    if(!userPortfolio){
      return res.status(400).json({ success: false, message: "Email no encontrado"});
    }

    //* Generamos un reset-token y el tiempo de expiracion
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000 // 1 hora

    //* Le asignamos al usuario el token
    userPortfolio.user.resetPasswordToken = resetToken;
    userPortfolio.user.resetPasswordExperiesAt = resetTokenExpiresAt;

    //* Actualizamos la BD
    await userPortfolio.save();

    //* Mandamos el mail
    //* Guardamos como parametro la url para poder reemplarla en el boton del mail que vamos a mandar
    await sendPasswordResetEmail(userPortfolio.user.email, `${clientUrl}/reset-password/${resetToken}`)

    res.status(200).json({ success: true, message: "Se mando el mail para restablecer la contraseña del usuario", token: userPortfolio.user.resetPasswordToken})

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export const resetPassword = async (req, res) => {
  try {
    //* Recibimos por body la contraseña nueva y el token que generamos en forgotPassword()
    const {token} = req.params;
    const {password} = req.body;

    //* Buscamos en la BD el usuario que tenga asignada esa token
    const userPortfolio = await Portfolio.findOne({ 
      "user.resetPasswordToken": token,
      "user.resetPasswordExperiesAt": { $gt: Date.now() }
    });

    if(!userPortfolio){
      return res.status(400).json({ success: false, message: "Token invalido o vencido"});
    }

    //* Si todo esta bien, actualizamos la contraseña y borramos de la BD el token
    const hashedPassword = await bcryptjs.hash(password, 10); // Encriptamos la contraseña
    userPortfolio.user.password = hashedPassword; // Se la asignamos al usuario encontrado anteriormente
    userPortfolio.user.resetPasswordToken = undefined; // Borramos de la BD el token de reseteo de contraseña 
    userPortfolio.user.resetPasswordExperiesAt= undefined;

    //* Guardamos en la BD
    await userPortfolio.save();

    //* Mandamos el mail del cambio de constraseña exitoso
    sendResetPasswordSuccess(userPortfolio.user.email)

    res.status(200).json({ success: true, message: "Se mando el mail de que la contraseña del usuario fue restablecida correctamente"})
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export const checkAuth = async (req, res) => {
  try {
    //* Usamos el userId que fue adjuntado al request por verifyToken para buscar el documento Portfolio correspondiente.
    const userPortfolio = await Portfolio.findOne({ 'user._id': req.userId });
    if (!userPortfolio) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    //* Si encuentra al usuario, devuelve la información del usuario (excluyendo la contraseña por seguridad).
    res.status(201).json({ 
      success: true, 
      user:{
        ...userPortfolio.user._doc,
        password: undefined,
      }
     });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}