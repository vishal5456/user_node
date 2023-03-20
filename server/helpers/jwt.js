import jwt from "jsonwebtoken";
import config from "../../config/env/index.js";


export const generateToken = (user) => {
  return jwt.sign(user, config.jwtSecretKey, {
    expiresIn: config.tokenExpiration,
  });
};


