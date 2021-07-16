import createError from "http-errors";

export const hostsOnly = (req: any, res: any, next: any) => {
  if (req.user.role === "host") {
    next();
  } else {
    next(createError(403, "Only Hosts"));
  }
};
