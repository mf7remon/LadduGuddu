"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";


export default function Home() {

  const router = useRouter();

  const [joinCode, setJoinCode] =
    useState("");


  useEffect(() => {

    socket.connect();


    socket.on(
      "room:created",
      (data) => {

        sessionStorage.setItem(
          "role",
          "HOST"
        );


        sessionStorage.setItem(
          "roomCode",
          data.roomCode
        );


        router.push(
          `/room/${data.roomCode}`
        );

      }
    );



    socket.on(
      "room:joined",
      (data) => {

        sessionStorage.setItem(
          "role",
          "GUEST"
        );


        sessionStorage.setItem(
          "roomCode",
          data.roomCode
        );


        router.push(
          `/room/${data.roomCode}`
        );

      }
    );


    socket.on(
      "room:error",
      (data) => {

        alert(data.message);

      }
    );


    return () => {

      socket.off("room:created");
      socket.off("room:joined");
      socket.off("room:error");

    };


  }, [router]);



  function createRoom() {

    socket.emit(
      "room:create"
    );

  }



  function joinRoom() {

    socket.emit(
      "room:join",
      joinCode
    );

  }



  return (

    <main className="flex min-h-screen flex-col items-center justify-center gap-8">


      <h1 className="text-5xl font-bold">
        LadduGuddu 🎬
      </h1>


      <button
        onClick={createRoom}
        className="rounded bg-black px-6 py-3 text-white"
      >
        Create Room
      </button>



      <div className="flex gap-3">

        <input

          value={joinCode}

          onChange={
            (e) =>
            setJoinCode(
              e.target.value.toUpperCase()
            )
          }

          placeholder="Room Code"

          className="border px-4 py-2"

        />


        <button

          onClick={joinRoom}

          className="rounded bg-blue-600 px-6 py-3 text-white"

        >

          Join Room

        </button>


      </div>


    </main>

  );

}