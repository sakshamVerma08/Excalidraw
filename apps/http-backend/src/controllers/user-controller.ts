// User Signup controller logic
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import {prisma} from "@excalidraw/db";
import {loginSchema, signUpSchema, CreateRoomSchema} from "@excalidraw/types";

export const signUpController = async  (req: Request, res: Response)=>{
    

    /*
    1. Use zod validations to validate the request body fields properly, then extract them from the req.body.
    2. Check if the existing User exists in the DB or not.
    3. If it's a new user, then create a new entry in DB
    4. To create a new entry in DB, firstly hash the password properly with 10 saltRounds
    5. Then Sign a new JWT token for the user, and attach the user details to the JWT token.

    */


    const validationResult = signUpSchema.safeParse(req.body);
    if(!validationResult.success){
        return res.status(400).json(validationResult.error);
    }

    const {name,email,password,photo} = validationResult.data;

    try{
        
        const dbResponse = await prisma.user.findUnique({
            where:{email:email}
    });


        if(dbResponse !== null) return res.status(400).json({message:"User already exists with same email"})


        }
        catch(err){
            console.error(err);
            return res.status(500).json({message:"Prisma Query Error"});
        }


    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password,saltRounds);
    
    let createdUser;
    try{
        createdUser = await prisma.user.create({
        data:{
            name,
            email,
            password: hashedPassword,
            photo

        }
    });


    const token = jwt.sign({sub:String(createdUser.id), email: createdUser.email, name: createdUser.name}, process.env.JWT_SECRET!,{
        expiresIn: "5d"
    });


    res.cookie('token', token,{
        httpOnly:true,
        secure:true,
        sameSite:'strict',
        
    });


    return res.status(200).json({message:"User signup successful"});


    
}catch(err){
    console.error(err);
    return res.status(500).json({message: "Error while inserting entry to DB"});
}

}

 
export const signInController = async(req: Request, res: Response)=>{

    /*
    1. Validate request body
    2. Check for user name/ email in the DB
    3. if user doens't exist return error
    4. Compare the password with bcrypt.compare()
    5. If password doesn't match, return error
    6. if everything is correct, assign a new JWT token, then store it in cookies, then return 201.

    */

    const validationResult = loginSchema.safeParse(req.body);

    if(!validationResult.success) return res.status(400).json({message:"Fields validation failed"});


    const {email,password} = validationResult.data;

    let existingUser;
    try{

        existingUser = await prisma.user.findFirst({
            where: {
                email:email
            }
        });

        if(!existingUser) return res.status(400).json({message:"User doesn't exist in the Database"});

    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Database error"});
    }


    try{
        const isPasswordCorrect = await bcrypt.compare(password,existingUser.password)

        if(!isPasswordCorrect) return res.status(400).json({message:"Wrong password entered"});
    }catch(err){

        console.error(err);
        return res.status(500).json({message:"Internal Server Error"});
    }


    const jwtPayload: JwtPayload = {
        sub: existingUser.id.toString(),
        name: existingUser.name,
        email: existingUser.email,
    };


    const token  = jwt.sign(jwtPayload , process.env.JWT_SECRET!, {
        expiresIn: '1d'
    });

    res.cookie("token",token,{
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });


    return res.status(201).json({message:"Login Successful"});


}


export const createRoom = async (req: Request, res: Response)=>{

    try{

    const validationResult = CreateRoomSchema.safeParse(req.body);

    if(!validationResult.success) return res.status(400).json({message:"Error while validating fields"});

    const {slug} = validationResult.data;

        const userId = req.user?.id;
    if(!userId) return res.status(401).json({message:"Unauthenticated User"});
    const adminId = parseInt(userId);

    await prisma.room.create({
        data:{
            admin:{
                connect:{
                    id:adminId
                }
            },
            slug: slug
        }
    });

    return res.status(201).json({message:"New room created successfully"});


    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Internal Server Error"});
    }
}