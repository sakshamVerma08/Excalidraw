"use client";
import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  const [roomName, setRoomName] = useState("");

  const router = useRouter();


  // The type assigned to e means that "This event is a React 'change event' that is coming from a HTML Input element"
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
      setRoomName(e.target.value);
    }


 return (

  <div className={"flex w-screen h-screen justify-center items-center "}>

    <div>
      
      <input value = {roomName} 
    onChange= {handleChange}

    type = "text"
    placeholder="Enter room name..."
    ></input>


    <button onClick={()=>{

        router.push(`/room/${roomName}`);

    }}>Join Room</button>
    
    </div>



  </div>
 );
}
