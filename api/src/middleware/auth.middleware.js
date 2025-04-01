import jwt from "jsonwebtoken";
import User from "../models/User.js";

// const response = await fetch(`http://localhost:3000/api/books`, {
//   method: "POST",
//   body: JSON.stringify({
//     title,
//     caption,
//   }),
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
// });

const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers("Authorization").replace("Bearer ", "");
    if (!token)
      return res.status(401).json({
        message: "Necessário token válido!",
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("_password");
    if (!user) return res.status(401).json({ message: "Token inválido!." });

    req.user = user;
    next();
  } catch (error) {
    console.error("Erro de autenticação: ", error.message);
    res.status(401).json({ message: "Token inválido!." });
  }
};

export default protectRoute;
