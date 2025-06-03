import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";


dotenv.config({
  path: "./.env",
});
const PORT = process.env.PORT || 3600;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`the server is running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("mongodb connection error", err);
  });


