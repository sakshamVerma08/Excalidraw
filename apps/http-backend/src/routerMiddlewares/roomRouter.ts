import express, { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getMessages } from "../controllers/room-controller.js";
const roomRouter : Router = express.Router();

roomRouter.use(authMiddleware);

roomRouter.get("/", getMessages);


export default roomRouter;