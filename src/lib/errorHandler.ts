import { NextFunction } from "express";

const notFound = (err: any, req: any, res: any, next: any) => {
  if (err.status === 404) {
    res.status(404).send(err.message);
  } else {
    next(err);
  }
};
const badRequest = (err: any, req: any, res: any, next: any) => {
  if (err.status === 400) {
    res.status(400).send(err.message);
  } else {
    next(err);
  }
};

const notAuthorized = (err: any, req: any, res: any, next: any) => {
  if (err.status === 401) {
    res.status(401).send(err.message);
  } else {
    next(err);
  }
};
const forbidden = (err: any, req: any, res: any, next: any) => {
  if (err.status === 403) {
    res.status(403).send(err.message);
  } else {
    next(err);
  }
};

const catchAll = (err: any, req: any, res: any, next: any) => {
  if (err) {
    res.status(500).send("Generic Server Error");
  }
  next();
};

export default [notFound, badRequest, notAuthorized, forbidden, catchAll];
