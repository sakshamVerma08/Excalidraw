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
    },[]);


    return {loading,socket};
}