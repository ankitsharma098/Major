import jwt from "jsonwebtoken";
import env from "../../env.js";

const generateAccessToken = (tokenDetails, tokenKey = env.ACCESS_TOKEN_SECRET, expiresIn = env.Access_Expiry) => {
  // Use an object with 'expiresIn' key in jwt.sign
  const accessToken = jwt.sign(  { _id: tokenDetails },
    tokenKey,
    { expiresIn: expiresIn }
  );
  return accessToken;
}

const generateRefreshToken = (tokenDetails, tokenKey = env.REFRESH_TOKEN_SECRET, expiresIn = env.Refresh_EXPIRY) => {
  // Use an object with 'expiresIn' key in jwt.sign
  const refreshToken = jwt.sign(
    { _id: tokenDetails },
    tokenKey,
    { expiresIn: expiresIn }
  );
  return refreshToken;
}

export { generateAccessToken, generateRefreshToken };
