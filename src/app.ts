import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response } from "express";
import mongoose from 'mongoose';
import authRouter from './routes/auth.router';

const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((): void => console.log("Database connected."))
  .catch((err): void => console.error(err));

app.get("/", (req: Request, res: Response): Response => {
  return res.status(200).send("ok");
});

app.use("/api", authRouter);

app.listen(4000, (): void => {
  console.log("Server Running on port 4000");
});