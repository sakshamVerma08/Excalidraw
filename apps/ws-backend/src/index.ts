import dotenv from "dotenv";
import path from "path";

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

    ws.on('message', function message(data){

        console.log("Received from client: ", data);
        ws.send('pong');
    });
});


httpServer.listen(8080,()=>{
    console.log("httpServer active on http://localhost:8080");
});