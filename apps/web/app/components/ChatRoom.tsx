import axios from "axios";
import { BACKEND_URL } from "../config";
import {RoomMessages} from "@excalidraw/types";

/* Purpose of this file:

1. This is a server component. It runs on the server. 
2. The job of this file is to export a ChatRoom() function, that will basically get all the chats for a specific roomId

*/

type Props = {
  roomId: string
};

async function getChats(roomId: string){

  try{  
    // Send the cookies as well (token)
  const response = await axios.get(`${BACKEND_URL}/api/room/`, {
      params:{
        roomId: roomId 
      },
      withCredentials:true
    });

    const messages: RoomMessages = response.data;
    return messages;

  }catch(err){
    console.error(err);
    return [];
    
  }

}


export async function ChatRoom({roomId} : Props){

 const messages: RoomMessages = await getChats(roomId);
  
  return messages;
}

export default ChatRoom;