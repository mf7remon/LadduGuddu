"use client";

import YouTube from "react-youtube";

import { useEffect, useRef } from "react";

import socket from "@/lib/socket";



interface Props {

  roomCode: string;

  isHost: boolean;

  videoId: string;

}





export default function YoutubePlayer({

  roomCode,

  isHost,

  videoId,

}: Props) {



  const playerRef:any =
    useRef(null);





  useEffect(() => {



    if(!isHost){


      socket.emit(

        "video:request-state",

        {
          roomCode
        }

      );


    }







    socket.on(

      "video:sync-state",

      (data)=>{


        if(!isHost && playerRef.current){



          playerRef.current.seekTo(
            data.currentTime
          );



          if(data.isPlaying){

            playerRef.current
              .playVideo();

          }



        }


      }

    );







    socket.on(

      "video:sync-update",

      (data)=>{


        if(!isHost && playerRef.current){



          const currentTime =
            playerRef.current
              .getCurrentTime();



          const difference =
            Math.abs(
              currentTime -
              data.currentTime
            );



          if(difference > 2){


            playerRef.current
              .seekTo(
                data.currentTime
              );


          }


        }


      }

    );







    socket.on(

      "video:play",

      ()=>{


        if(!isHost){

          playerRef.current
            ?.playVideo();

        }


      }

    );







    socket.on(

      "video:pause",

      ()=>{


        if(!isHost){

          playerRef.current
            ?.pauseVideo();

        }


      }

    );







    socket.on(

      "video:seek",

      (time)=>{


        if(!isHost){

          playerRef.current
            ?.seekTo(time);

        }


      }

    );







    return ()=>{


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



  },[isHost,roomCode]);









  function onReady(event:any){


    playerRef.current =
      event.target;


  }







  function onStateChange(event:any){


    if(!isHost) return;



    if(event.data === 1){


      socket.emit(

        "video:play",

        {
          roomCode
        }

      );


    }





    if(event.data === 2){


      socket.emit(

        "video:pause",

        {
          roomCode
        }

      );


    }



  }







  return (

    <YouTube

      videoId={videoId}

      onReady={onReady}

      onStateChange={onStateChange}

      opts={{

        width:"100%",

        playerVars:{

          autoplay:0,

        }

      }}

    />

  );

}