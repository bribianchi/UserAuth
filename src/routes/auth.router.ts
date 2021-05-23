import express from "express";
import { forgot, getUserInfo, login, refreshToken, reset, signup } from "../controllers/auth.controller";
import { checkAuth } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/auth/signup", signup);

router.post("/auth/login", login);

router.post("/auth/forgot", forgot);

router.post("/auth/reset", reset);

router.post("/auth/refresh_token", refreshToken);

router.get("/auth/:userid", checkAuth, getUserInfo);

export default router;