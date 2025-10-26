import prisma from "@excalidraw/db";
import { CreateRoomSchema, GetRoomsRouteParams } from "@excalidraw/types";
import { Request, Response } from "express";
import * as z from "zod";

export const getMessages = async (req:Request, res: Response)=>{

    
    try{
        const validationResult = GetRoomsRouteParams.safeParse(req.query);

        if(!validationResult.success) return res.status(400).json({error: validationResult.error.issues});

        const roomId = parseInt(validationResult.data.roomId);

        console.log("\n Looking for previous messages in DB");
        const previousMessages = await prisma.message.findMany({
            where:{
                roomId
            },
            select:{
                    user: {
                        select:{
                            id:true,
                            name: true,
                            email:true,
                            photo:true
                        },

                    },
                    
                    message:true,
                    created_at:true,
            },

            orderBy:{
                created_at:'asc'
            }
        });


        if(previousMessages.length===0){
            console.log("❌Found nothing in DB\n");
            return res.status(400).json({message:"No previous messages found in DB"});
        }

        console.log("Found something ✅")


        return res.status(200).json({data:previousMessages, message:"✅Previous Messages fetched successfully"});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Internal Server Error"});
    }

}




export const createRoom = async (req: Request, res: Response)=>{

    try{

    const validationResult = CreateRoomSchema.safeParse(req.body);

    if(!validationResult.success) return res.status(400).json({error: validationResult.error.issues});

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


// export const joinRoom = async (req: Request, res: Response)=>{


// }