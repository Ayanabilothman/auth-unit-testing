import mongoose from "mongoose";

const connectDB = async () =>
  await mongoose
    .connect(process.env.CONNECTION_URL)
    .then(() => console.log("DB connected"))
    .catch(() => console.log("DB failed to connect!"));
export default connectDB;
