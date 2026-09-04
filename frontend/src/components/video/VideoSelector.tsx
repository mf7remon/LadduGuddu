"use client";

import { useState } from "react";
import socket from "@/lib/socket";


interface Props {
  roomCode: string;
  isHost: boolean;
}


export default function VideoSelector({
  roomCode,
  isHost,
}: Props) {


  const [url, setUrl] =
    useState("");



  function loadVideo() {


    if (!isHost) return;


    socket.emit(
      "video:change-source",
      {
        roomCode,
        url,
      }
    );


  }



  if (!isHost) return null;



  return (

    <div className="flex gap-3">


      <input

        value={url}

        onChange={(e)=>
          setUrl(e.target.value)
        }

        placeholder="Enter video URL"

        className="border px-3 py-2 rounded"

      />



      <button

        onClick={loadVideo}

        className="bg-blue-600 text-white px-4 py-2 rounded"

      >

        Load Video

      </button>


    </div>

  );

}