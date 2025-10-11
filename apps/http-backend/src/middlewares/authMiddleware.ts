import { NextFunction, Request, Response } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction)=>{

    try{
        
        const token = req.cookies.token;

    if(!token) return res.status(401).json({message:"Unauthenticated user"});


    const decodedToken = jwt.verify(token,process.env.JWT_SECRET!) as JWT.UserToken;


    req.user = {
        id: decodedToken.sub,
        name: decodedToken.name,
        email: decodedToken.email
    }

    console.log("\n\r\nAttatched user id = ", decodedToken.sub, "\n");

    next();

    }catch(err){
        console.error(err);
        return res.status(403).json({message:"Unauthenticated User"});
    }


}