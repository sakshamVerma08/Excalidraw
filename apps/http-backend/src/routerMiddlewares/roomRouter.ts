import express, { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createRoom, getMessages, getRoomId } from "../controllers/room-controller.js";
const roomRouter : Router = express.Router();

roomRouter.use(authMiddleware);

roomRouter.get("/", getMessages);

// Get the room's ID, provided the room's slug from frontend route parameter
roomRouter.get("/:slug", getRoomId )

roomRouter.post("/", authMiddleware, createRoom);



export default roomRouter;