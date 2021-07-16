import { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";

type ErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

const notFound: ErrorHandler = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send(err.message);
  } else {
    next(err);
  }
};
const badRequest: ErrorHandler = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send(err.message);
  } else {
    next(err);
  }
};

const notAuthorized: ErrorHandler = (err, req, res, next) => {
  if (err.status === 401) {
    res.status(401).send(err.message);
  } else {
    next(err);
  }
};
const forbidden: ErrorHandler = (err, req, res, next) => {
  if (err.status === 403) {
    res.status(403).send(err.message);
  } else {
    next(err);
  }
};

const catchAll: ErrorHandler = (err, req, res, next) => {
  if (err) {
    res.status(500).send("Generic Server Error");
  }
  next();
};

export default [notFound, badRequest, notAuthorized, forbidden, catchAll];
