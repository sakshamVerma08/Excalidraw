"use client";
import { RoomMessages } from "@excalidraw/types";
import { useSocket } from "../hook/useSocket";
import { useEffect, useState } from "react";

/* The purpose of this file:
1. This is a client component because in this file, we initiate a socket connection for the user to the ws-backend server.

*/

type Props = {

    messages: RoomMessages,
    id: number
}
export function ChatRoomClient({messages,id}: Props){


    const {socket, loading} = useSocket();
    const [chats, setChats] = useState([]);

    useEffect(()=>{

        if(socket && !loading){

            socket.onmessage = (event)=>{

                if(event.data){
                }
            }
        }
    }, [socket,loading]);

}