"use client";

import { useEffect, useRef, useState } from "react";
import socket from "@/lib/socket";


interface VideoPlayerProps {

  roomCode: string;

  isHost: boolean;

}



export default function VideoPlayer({

  roomCode,

  isHost,

}: VideoPlayerProps) {



  const videoRef =
    useRef<HTMLVideoElement | null>(null);



  const [syncStatus, setSyncStatus] =
    useState("Ready");



  useEffect(() => {


    const video =
      videoRef.current;


    if (!video) return;



    setSyncStatus("Connected");




    if (!isHost) {


      socket.emit(
        "video:request-state",
        {
          roomCode
        }
      );


    }






    let interval:any;



    if (isHost) {


      interval = setInterval(() => {


        socket.emit(
          "video:sync-check",
          {

            roomCode,

            currentTime:
              video.currentTime

          }
        );


      },5000);


    }








    socket.on(
      "video:sync-state",
      (data) => {


        if (!isHost) {


          video.currentTime =
            data.currentTime;



          if (data.isPlaying) {

            video.play();

          }


          setSyncStatus("Synced ✅");


        }


      }
    );








    socket.on(
      "video:sync-update",
      (data) => {


        if (!isHost) {


          const difference =
            Math.abs(
              video.currentTime -
              data.currentTime
            );



          if (difference > 2) {


            video.currentTime =
              data.currentTime;


            setSyncStatus(
              "Correcting Sync..."
            );


          } else {


            setSyncStatus(
              "Synced ✅"
            );


          }


        }


      }
    );








    socket.on(
      "video:play",
      () => {


        if (!isHost) {


          video.play();

          setSyncStatus(
            "Playing ▶️"
          );


        }


      }
    );








    socket.on(
      "video:pause",
      () => {


        if (!isHost) {


          video.pause();

          setSyncStatus(
            "Paused ⏸️"
          );


        }


      }
    );








    socket.on(
      "video:seek",
      (time) => {


        if (!isHost) {


          video.currentTime =
            time;


          setSyncStatus(
            "Synced ✅"
          );


        }


      }
    );








    return () => {


      clearInterval(interval);


      socket.off(
        "video:sync-state"
      );


      socket.off(
        "video:sync-update"
      );


      socket.off(
        "video:play"
      );


      socket.off(
        "video:pause"
      );


      socket.off(
        "video:seek"
      );


    };



  },[roomCode,isHost]);








  function handlePlay(){


    if(!isHost) return;



    socket.emit(
      "video:play",
      {
        roomCode
      }
    );


  }








  function handlePause(){


    if(!isHost) return;



    socket.emit(
      "video:pause",
      {
        roomCode
      }
    );


  }








  function handleSeek(){


    if(!isHost) return;



    socket.emit(
      "video:seek",
      {

        roomCode,

        time:
          videoRef.current?.currentTime || 0

      }
    );


  }








  function handleLoadedMetadata(){


    if(!isHost) return;



    socket.emit(
      "video:send-state",
      {

        roomCode,

        currentTime:
          videoRef.current?.currentTime || 0,


        isPlaying:
          !videoRef.current?.paused

      }
    );


  }








  return (

    <div className="w-full max-w-4xl">


      <video

        ref={videoRef}

        controls={isHost}

        onPlay={handlePlay}

        onPause={handlePause}

        onSeeked={handleSeek}

        onLoadedMetadata={handleLoadedMetadata}

        className="w-full rounded-lg"

      >

        <source

          src="https://www.w3schools.com/html/mov_bbb.mp4"

          type="video/mp4"

        />

      </video>



      <p className="mt-2 text-sm">

        {syncStatus}

      </p>


    </div>

  );

}