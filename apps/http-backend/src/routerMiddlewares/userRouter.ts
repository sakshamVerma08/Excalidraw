import express, { Router } from "express";
import { createRoom, signInController, signUpController } from "../controllers/user-controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router: Router = express.Router();

// /sign-up route and /sign-in routes will be public routes.

router.post('/sign-up',signUpController );

router.post("/sign-in", signInController);


router.post("/room", authMiddleware, createRoom);


export default router;