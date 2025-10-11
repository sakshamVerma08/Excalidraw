import dotenv from "dotenv";
const loadedVariables = dotenv.config({path:"../../../.env"});


if(loadedVariables.parsed) console.info("Environment variables loaded successfully");

import {WebSocketServer, WebSocket} from "ws";
import express  from "express";
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
        socket.destroy();
        return;
    }


    try{
        const user = jwt.verify(token, process.env.JWT_SECRET!);
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

wss.on('connection', function connection(ws: WebSocket & {user?:any}){


    console.log("Authenticated User ✅\n");

    ws.on('message', function message(data){

        ws.send('pong');
    });
});


httpServer.listen(8080,()=>{
    console.log("httpServer active on http://localhost:8080");
})