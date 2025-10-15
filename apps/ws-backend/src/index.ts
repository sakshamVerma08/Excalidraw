import dotenv from "dotenv";
import path, { parse } from "path";
import {prisma} from "@excalidraw/db";
import type { User, Message } from '@excalidraw/types';
const loadedVariables = dotenv.config({
    path: path.join(process.cwd(),"../../.env")
});

import {WebSocketServer, WebSocket} from "ws";
import express, { Request }  from "express";
import * as cookie from "cookie";
import jwt from "jsonwebtoken";
import http, { IncomingMessage } from "http";

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



// WebSocket Server Code 
wss.on('connection', function connection(ws: WebSocket & {user?:any}){


    console.log("Authenticated User ✅\n");

    ws.on('message', 
        async function message(data){

        const parsedData = JSON.parse(data as unknown as string);
        const userId : number = parseInt(ws.user.sub); 
        

        if(parsedData.type==="join_room"){

            // Logic for Join_room message
        // Message from client: {type: "join_room",slug: "chat-room-1"}
        /*
        1. First check in DB if the room even exists or not. If it doens't then close the socket connection & return, else continue.
        2. In the DB, update the current room's "roomParticipants" field to store current user's id.
        3. In the DB, update the user's room field to store the current room id.
        */
            
                try {
                    await prisma.$transaction(
                        async (tx) => {
                        // 1. Check if the room exists
                        const currentRoom = await tx.room.findFirst({
                        where: {
                            slug: parsedData.slug
                        }
                        });

                        if (!currentRoom) {
                        ws.close();
                        throw new Error('Room does not exist');
                        }

                        // 2. Add the userId to room's participants list
                        await tx.room.update({
                        where: {
                            slug: currentRoom.slug
                        },
                        data: {
                            roomParticipants: {
                            connect: { id: userId }
                            }
                        }
                        });

                        // 3. Add the room's id to user's joinedRooms list
                        await tx.user.update({
                        where: {
                            id: userId
                        },
                        data: {
                            rooms: {
                            connect: {
                                id: currentRoom.id
                            }
                            }
                        }
                        });
                    },
                {
                    maxWait: 5000,
                    timeout: 10000
                });

                ws.send(JSON.stringify({status:"✅successfully joined the room "}));
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

                await prisma.$transaction(
                    async(tx)=>{

                // Removing the current user's id from 'roomParticipant' list.
                await tx.room.update({
                    where:{
                        slug: parsedData.slug
                    },

                    data:{
                        roomParticipants:{
                            disconnect:[{
                                id: userId
                            }]
                        }
                    }
                });

                // Update the same on the user's table , in his 'rooms' list
                await tx.user.update({

                    where:{
                        id: userId
                    },

                    data:{
                        rooms:{
                            disconnect:[{
                                slug: parsedData.slug
                            }]
                        }
                    }
                })

            },{
                maxWait: 5000,
                timeout: 10000
            });

            ws.send(JSON.stringify({status:"✅successfully left the room"}));

            }catch(err){
                console.error("❌Error while leaving the room \n\r\n");
                console.error(err);
                ws.send(JSON.stringify({error: err,message:"❌Error while leaving the room \n\r\n"}) );
                ws.close();
            }
            
            return;
        }

        if(parsedData.type==="chat"){
            // Logic for sending a chat message
            // Message body : {type:"chat", roomId: 123, message:"Hello Everyone!"}
            /*
            1. Check whether the room exists or not, and whether user is part of the room or not.
            2. Create a new Chat message in the Message table.
            3. Broadcast the message to all the users in the current Room.
            */



            const result: any  = await prisma.$transaction(
                async (tx)=>{

                const room = await tx.room.findFirst({
                where:{
                    slug: parsedData.slug,
                    roomParticipants:{
                        some:{
                            id: userId
                        }
                    }
                },
                include:{
                    roomParticipants: true,
                }
            });

            if(!room){
                ws.send("❌Either the room doesn't exist or user is not a part of that room");
                ws.close();
                return;
            }

            // Saving the message in the "Message" table.
            const message = await tx.message.create({
                data:{
                    roomId: room.id,
                    userId: userId,
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


            return {message, participants: room.roomParticipants};

            }, {
                maxWait: 5000,
                timeout: 10000
            });

            
             wss.clients.forEach((client)=>{
                const wsClient = client as WebSocket & {user?:any};

                // Checking if client is authenticated and a participant of the current room.
                if(wsClient.readyState===WebSocket.OPEN && wsClient.user && result.participants.some( (p:User)=> p.id === wsClient.user.sub)){
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