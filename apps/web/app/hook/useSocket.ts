import { useEffect, useState } from "react"
import { WS_URL } from "../config";

export const useSocket = ()=>{

    const [loading,setLoading] = useState(true);
    const [socket,setSocket] = useState <WebSocket | null>(null);

    useEffect(()=>{
        // WIP: Send the token here as well.

        
        const ws = new WebSocket(`${WS_URL}`);
        
        ws.onopen = ()=>{
            setLoading(false);
            setSocket(ws);
        }

        ws.onerror = (error)=>{
            console.error("Websocket error:", error);
            setLoading(false);
        }

        return ()=>{
            ws.close();
        }

    },[]);


    return {loading,socket};
}