import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "./utils/logger.js";
import morgan from "morgan";


const app = express();


const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);




app.use(
  cors({
    origin: process.env.CORS_ORGIN,
    credentials: true,
  })
);

//common middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({extended:true,limit:"16kb"
}))
app.use(express.static("public"))
app.use(cookieParser())

//import routes
import heathcheckRouter from "./routes/healthcheck.routes.js"
import userRouter from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import videoRouter from "./routes/video.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import  SubscriptionRouter  from "./routes/subscription.routes.js";
import playListRouter from "./routes/playlist.routes.js"


app.use("/api/v1/healthcheck",heathcheckRouter)
app.use("/api/v1/user", userRouter);
app.use("/api/v1/video",videoRouter);
app.use("/api/v1/tweet",tweetRouter);
app.use("/api/v1/sub",SubscriptionRouter)
app.use("/api/v1/playlist",playListRouter)



app.use(errorHandler)

export { app };
