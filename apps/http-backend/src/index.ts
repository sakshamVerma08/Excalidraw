import dotenv from "dotenv";
const loadedVariables = dotenv.config({path:"../../.env"});

if(loadedVariables.parsed) console.info("env variables loaded successfully \n\n");

import express, {Express, Request, Response} from "express";
import cookieParser from "cookie-parser";
import router from "./routerMiddlewares/userRouter.js";
import roomRouter from "./routerMiddlewares/roomRouter.js";
const app: Express = express();
const PORT = 4000;
// Using application level middlewares.

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// Using Router level middlewares

app.use("/api/user", router);
app.use("/api/room", roomRouter);

app.get("/", (req: Request,res: Response)=>{

    res.send("Excalidraw-HTTP Backend");
});


// Test route for Supertest/Jest code.
app.get("/health", (req: Request, res: Response)=>{

    return res.status(200).json({message:"✅Server health looking good "});
})


//  app.listen(PORT,()=>{
//      console.log(`HTTP server is live at http://localhost:${PORT}`);
//  });

export default app;