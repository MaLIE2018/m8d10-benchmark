import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../../types/interfaces";

const generateAccessToken = (payload: {}) =>
  new Promise<string>((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: "10 min" },
      (err, token) => {
        if (err) reject(err);

        resolve(token!);
      }
    )
  );

const generateRefreshToken = (payload: {}) =>
  new Promise<string>((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: "15 days" },
      (err, token) => {
        if (err) reject(err);

        resolve(token!);
      }
    )
  );

export const JWTAuthenticate = async (user: User) => {
  const accessToken = await generateAccessToken({ _id: user._id });
  const refreshToken = await generateRefreshToken({ _id: user._id });

  user.refreshToken = refreshToken;

  await user.save();
  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (refreshToken: string) =>
  new Promise((resolve, reject) =>
    jwt.verify(refreshToken, process.env.JWT_SECRET!, (err, decodedToken) => {
      if (err) reject(err);

      resolve(decodedToken);
    })
  );

export const verifyAccessToken = (accessToken: string) =>
  new Promise<JwtPayload>((resolve, reject) =>
    jwt.verify(accessToken, process.env.JWT_SECRET!, (err, decodedToken) => {
      if (err) reject(err);

      resolve(decodedToken!);
    })
  );
