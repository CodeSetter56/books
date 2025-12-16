import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import cors from "cors";
import { config } from "./config/config";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";

const app = express();
app.use(
  cors({
    origin: config.frontendUrl,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

app.use(globalErrorHandler);

export default app;
