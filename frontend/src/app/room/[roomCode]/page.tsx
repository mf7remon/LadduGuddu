"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import socket from "@/lib/socket";


export default function RoomPage() {


  const params = useParams();

  const router = useRouter();

  const roomCode =
    params.roomCode as string;


  const [status, setStatus] =
    useState(
      "Waiting for partner..."
    );



  useEffect(() => {


    socket.connect();



    socket.emit(
      "room:rejoin",
      roomCode
    );



    // Guest join করলে নিজের status update

    const role =
      sessionStorage.getItem("role");


    if (role === "GUEST") {

      setStatus(
        "Partner Connected 🟢"
      );

    }




    socket.on(
      "participant:joined",
      () => {

        setStatus(
          "Partner Connected 🟢"
        );

      }
    );




    socket.on(
      "participant:left",
      () => {

        setStatus(
          "Partner Left 🔴"
        );

      }
    );




    return () => {

      socket.off(
        "participant:joined"
      );


      socket.off(
        "participant:left"
      );


    };


  }, [roomCode]);






  function leaveRoom() {


    socket.emit(
      "room:leave",
      roomCode
    );


    router.push("/");


  }






  return (

    <main className="flex min-h-screen flex-col items-center justify-center gap-5">


      <h1 className="text-4xl font-bold">
        LadduGuddu Room 🎬
      </h1>



      <p>
        Room Code:
      </p>



      <h2 className="text-5xl font-bold">
        {roomCode}
      </h2>




      <p className="text-xl">
        {status}
      </p>





      <button

        onClick={leaveRoom}

        className="rounded bg-red-600 px-6 py-3 text-white"

      >

        Leave Room

      </button>




    </main>

  );


}