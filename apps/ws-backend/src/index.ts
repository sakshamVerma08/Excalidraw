import dotenv from "dotenv";
import path, { parse } from "path";
import {prisma} from "@excalidraw/db";

const loadedVariables = dotenv.config({
    path: path.join(process.cwd(),"../../.env")
});

import {WebSocketServer, WebSocket} from "ws";
import express, { Request }  from "express";
import * as cookie from "cookie";
import jwt from "jsonwebtoken";
import http, { IncomingMessage } from "http";

interface User{
        id: string | undefined ,
        name: string,
        email: string,
        password:string,
    }

/* Creating a common http server that handles ws handshakes, and during that , inside the http server, the jwt token is verified. */
const app = express();
const httpServer = http.createServer(app);


const wss = new WebSocketServer({noServer:true});

httpServer.on('upgrade', (req: IncomingMessage,socket,head)=>{
console.log("=== Incoming Upgrade Request ===");
  console.log("Headers:", req.headers);
  console.log("===============================");
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token;



    if(!token){
        socket.write("HTTP/1.1 401 Unauthorized \r\n\r\n");
        console.info("\nDestroying the socket. 401 Unauthorized\n\n");
        socket.destroy();
        return;
    }


    try{

        if(typeof (process.env.JWT_SECRET) === 'undefined'){
            console.error("\n\r\nJWT SECRET IS MISSING ❌\n\r\n");
            socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\nMissing JWT_SECRET on server");
            socket.destroy();
            return;
        }

        const user= jwt.verify(token, process.env.JWT_SECRET!);
        wss.handleUpgrade(req,socket,head,(ws)=>{
            (ws as any).user = user;

            wss.emit('connection',ws,req);
        })
    }catch(err){
        socket.write("HTTP/1.1 403 Forbidden \r\n\r\n");
        socket.destroy();
    }
}


);


const users : User[] = [];

// WebSocket Server Code 
wss.on('connection', function connection(ws: WebSocket & {user?:any}){


    console.log("Authenticated User ✅\n");

    ws.on('message', async function message(data){

        const parsedData = JSON.parse(data as unknown as string);
        

        if(parsedData.type==="join_room"){

            // Logic for Join_room message
        // Message from client: {type: "join_room",roomId: 1}
        /*
        1. First check in DB if the room even exists or not. If it doens't then close the socket connection & return, else continue.
        2. In the DB, update the current room's "roomParticipants" field to store current user's id.
        3. In the DB, update the user's room field to store the current room id.
        */
            
                try {
                    await prisma.$transaction(async (tx) => {
                        // 1. Check if the room exists
                        const currentRoom = await tx.room.findFirst({
                        where: {
                            id: parsedData.roomId
                        }
                        });

                        if (!currentRoom) {
                        ws.close();
                        throw new Error('Room does not exist');
                        }

                        // 2. Add the userId to room's participants list
                        await tx.room.update({
                        where: {
                            id: currentRoom.id
                        },
                        data: {
                            roomParticipants: {
                            connect: { id: ws.user.sub }
                            }
                        }
                        });

                        // 3. Add the room's id to user's joinedRooms list
                        await tx.user.update({
                        where: {
                            id: ws.user.sub
                        },
                        data: {
                            rooms: {
                            connect: {
                                id: currentRoom.id
                            }
                            }
                        }
                        });
                    });
        } catch (err) {
        console.error("❌Error while joining the room\n\r\n");
        console.error(err);
        ws.send("❌Error while joining the room\n\r\n");
        ws.close();
        return;
        }

}

        if(parsedData.type==="leave_room"){
            // Logic for leaving a room 
            // Message from client: {type: "leave_room", roomId: 2}
            /*
            1. Find the user, and remove the current room id from his/her 'joinedRooms' list.
            2. From the currentRoom's 'roomParticipants' list, remove the user's id.
            */

            try{

                await prisma.$transaction(async(tx)=>{

                // Removing the current user's id from 'roomParticipant' list.
                await prisma.room.update({
                    where:{
                        id: parsedData.roomId
                    },

                    data:{
                        roomParticipants:{
                            delete:{
                                id: ws.user.sub
                            }
                        }
                    }
                });


                await prisma.user.update({

                    where:{
                        id: ws.user.sub
                    },

                    data:{
                        rooms:{
                            delete:{
                                id: parsedData.roomId
                            }
                        }
                    }
                })

            });

            }catch(err){
                console.error("❌Error while leaving the room \n\r\n");
                console.error(err);
                ws.send("❌Error while leaving the room \n\r\n");
                ws.close();
                return;
            }

        }

        if(parsedData.type==="chat"){
            // Logic for sending a chat message
            // Message body : {type:"chat", roomId: 123, message:"Hello Everyone!"}
            /*
            1. Check whether the room exists or not, and whether user is part of the room or not.
            2. Create a new Chat message in the Message table.
            3. Broadcast the message to all the users in the current Room.
            */

            const room = await prisma.room.findFirst({
                where:{
                    id: parsedData.roomId,
                    roomParticipants:{
                        some:{
                            id: ws.user.sub
                        }
                    }
                },
                include:{
                    roomParticipants: true
                }
            });

            if(!room){
                ws.send("❌Either the room doesn't exist or user is not a part of that room");
                ws.close();
                return;
            }

            // Saving the message in the "Message" table.
            const message = await prisma.message.create({
                data:{
                    userId: ws.user.sub,
                    roomId: parsedData.roomId,
                    message: parsedData.message,
                    created_at: new Date()
                    
                },
                include:{
                    user:{
                        select:{
                            id: true,
                            name:true,
                            email:true
                        }
                    }
                }
            });

            if(!message){
                ws.send("❌Couldn't save the message in DB");
                ws.close();
                return;
            }

            wss.clients.forEach((client)=>{
                const wsClient = client as WebSocket & {user?:any};

                // Checking if client is authenticated and a participant of the current room.
                if(wsClient.readyState===WebSocket.OPEN && wsClient.user && room.roomParticipants.some(p=> p.id === wsClient.user.sub)){
                    wsClient.send(JSON.stringify(message));
                }
            });


        }

        console.log("Received from client: ", data);
        ws.send('pong');
    });
});


httpServer.listen(8080,()=>{
    console.log("httpServer active on http://localhost:8080");
});