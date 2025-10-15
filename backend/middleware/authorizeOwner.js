import Portfolio from "../models/portfolio.model.js";

export const authorizeOwner = async (req, res, next) => {
  const { userId } = req; // Este es el ID del usuario autenticado que llega desde el middleware de verificación del token
  const { userName } = req.params;

  try {
    // Busca el portafolio por el nombre de usuario y verifica que coincida con el usuario autenticado
    const portfolio = await Portfolio.findOne({ "user.userName": userName });
    if (!portfolio) {
      return res.status(404).json({ message: "Portafolio no encontrado" });
    }

    // Verifica si el usuario autenticado es el dueño del portafolio
    if (portfolio.user._id.toString() !== userId) {
      return res.status(403).json({ message: "No autorizado" });
    }

    req.portfolio = portfolio; // pass the portfolio to the controller.

    next();
  } catch (error) {
    res.status(500).json({ message: "Error de servidor" });
  }
};