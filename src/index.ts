import mongoose from "mongoose";
import app from "./app";

export const PORT = process.env.PORT || 3001;

process.env.TS_NODE_DEV && require("dotenv").config();

console.log("process.env.MDB_URL:", process.env.MDB_URL);
if (!process.env.MDB_URL) throw new Error("MDB_URL not	set!");

mongoose.connect(process.env.MDB_URL, { useNewUrlParser: true }).then(() => {
  app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
  });
});
