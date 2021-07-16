import express from "express";
import cors from "cors";
import accommodationRouter from "./services/accommodation";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/accommodation", accommodationRouter);

// service/route files ==> index == export route into this file

export default app;
