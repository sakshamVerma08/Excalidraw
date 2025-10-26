import dotenv from "dotenv";
import path, { parse } from "path";
import {prisma} from "@excalidraw/db";
import type { User, Message,  ChatTransactionResult} from '@excalidraw/types';
const loadedVariables = dotenv.config({
    path: path.join(process.cwd(),"../../.env")
});

import {WebSocketServer, WebSocket} from "ws";
import express, { Request }  from "express";
import * as cookie from "cookie";
import jwt from "jsonwebtoken";
import http, { IncomingMessage } from "http";
import cors from "cors";

/* Creating a common http server that handles ws handshakes, and during that , inside the http server, the jwt token is verified. */
const app = express();
// Using cors in HTTP server.

app.use(cors({
    origin: ["http://localhost:3000"/* Add the vercel deployment url as well*/],
    credentials:true
}));
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
            // Message from client: {type: "leave_room", slug: roomName}
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
            }
            
            return;
        }

        if(parsedData.type==="chat"){

            try{

                /* parsedData structure: {type: chat,
                                            slug: roomName,
                                            message: Hello everyone}
                */

                const slug = parsedData.slug;
                const incomingMessage = parsedData.message;

                /*
                1. Firstly, check if the room exists or not, and if the current user is part of that room or not.
                2. Insert the message in the Message table and then send the message to all the authenticated users who are participants of the room.
                */

                const room = await prisma.room.findFirst({
                        where:{
                            slug: slug,
                            roomParticipants:{
                                some:{
                                    id: userId
                                }
                            }
                        },
                        include:{
                            roomParticipants:true
                        }
                });


                if(!room){
                    ws.send(JSON.stringify({message:"❌Room not found"}));
                    return;
                }


                const result = await prisma.$transaction(async(tx)=>{

                    // Storing the message in room.

                    const storedMessage = await tx.message.create({
                        data:{
                            userId: userId,
                            roomId: room.id,
                            message: incomingMessage,
                            created_at: new Date()
                        }, 

                        include:{
                                user:{
                                    select:{
                                        id:true,
                                        name: true,
                                        email:true,
                                        photo:true
                                    }
                                }

                                
                            }
                    });

                    return {message: storedMessage, roomParticipants: room.roomParticipants}
                }, {
                    maxWait: 5000,
                    timeout: 10000
                }) as ChatTransactionResult;

                const participantsId = new Set(
                    result.roomParticipants.map(p=>p.id.toString())
                );

                wss.clients.forEach((client)=>{

                    const wsClient = client as WebSocket & {user?:any};

                    // Check if the client is authenticated or not.
                    if(wsClient.readyState===WebSocket.OPEN &&
                        wsClient.user && 
                        participantsId.has(wsClient.user.sub.toString())
                    ){

                        wsClient.send(JSON.stringify({
                            type:"chat",
                            data: result.message
                        }));
                    }
    
    
                });

                console.log("\nMessage broadcasted✅to all the connected clients\n");



            }catch(err){
                console.error("❌Error while sending the chat message");
                ws.send(JSON.stringify({
                    err: "❌Failed to send message"
                }));
            }


            return;
        }

        console.log("Received from client: ", data);
        ws.send('pong');
    });
});


httpServer.listen(8080,()=>{
    console.log("httpServer active on http://localhost:8080");
});