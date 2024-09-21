import express from "express";
import authRouter from "./src/modules/auth/auth.router.js";
import connectDB from "./DB/connection.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.PORT;

await connectDB();
app.use(express.json());
app.use("/auth", authRouter);
app.use((error, req, res, next) => {
  return res.json({ success: false, error: error.message });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
