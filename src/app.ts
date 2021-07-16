import express from "express";
import cors from "cors";
import accommodationRouter from "./services/accommodation";
import errorHandlers from "./lib/errorHandler";
import userRouter from "./services/user";
import cookieParser from "cookie-parser";

const app = express();

const corsOptions = { origin: "http://localhost:3000", credentials: true };

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/accommodation", accommodationRouter);
app.use("/users", userRouter);
app.use(errorHandlers);

// service/route files ==> index == export route into this file

export default app;
