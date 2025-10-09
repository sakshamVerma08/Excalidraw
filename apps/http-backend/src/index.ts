import express, { Request, Response} from "express";
import cookieParser from "cookie-parser";
import router from "./routerMiddlewares/userRouter.js";
import dotenv from "dotenv";
dotenv.config({path:"./.env"});
const app = express();
const PORT = 4000;
// Using application level middlewares.

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// Using Router level middlewares

app.use("/api/user", router);


app.get("/", (req: Request,res: Response)=>{

    res.send("Excalidraw-HTTP Backend");
});


app.listen(PORT,()=>{
    console.log(`HTTP server is live at http://localhost:${PORT}`);
});

