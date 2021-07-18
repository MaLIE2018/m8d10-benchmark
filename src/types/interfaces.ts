import { NextFunction, Request, Response } from "express";

export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  refreshToken: string;
  save: Function;
}

export interface Accommodation {
  _id: string;
  name: string;
  location: { _id: string; location: string; __v: number };
  description: string;
  maxGuests: number;
}

export interface Destination {
  _id: string;
  location: string;
}

enum Role {
  "host",
  "guest",
}

export interface newUser {
  name: string;
  password: string;
  email: string;
  role: string;
  _id: string;
}

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;
