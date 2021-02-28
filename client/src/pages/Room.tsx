import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player/lazy';
import {
    useParams,
} from "react-router-dom";
import io from "socket.io-client";

interface RoomProps {}

let socket;

const Room: React.FC<RoomProps> = ({}) => {

    const ENDPOINT = "http://localhost:3001";

    let roomID:any = useParams();
    console.log(roomID);
    roomID = roomID.roomID;

    const [roomData, setRoomData] = useState<any>({});

    const [currentVideo, setCurrentVideo] = useState<string>("");

    const [queue, setQueue] = useState<string[]>([]);

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("connected", roomID);
        socket.on("connectedResponse", (res) => {
            console.log(res);
            setRoomData(res);
        })
    
        socket.on("playClient", (data) => {
        //   console.log(data);
            setIsPlaying(true);
        })

        socket.on("pauseClient", (data) => {
            // console.log(data);
            setIsPlaying(false);
          })
    
        return () => {
          socket.emit("disconnected", "disconnected");
          socket.disconnect();
          socket.off();
        }
      }, [ENDPOINT])

    useEffect(() => {
        setQueue((prev) => [...prev,"https://www.youtube.com/watch?v=iv8rSLsi1xo&ab_channel=AnsonAlexander"]);
        setCurrentVideo("https://www.youtube.com/watch?v=iv8rSLsi1xo&ab_channel=AnsonAlexander");
    }, [setQueue, setCurrentVideo])

    const changeUrl = (url:any) => {
        setCurrentVideo(url);
    }

    var newVideo = "https://www.youtube.com/watch?v=Rq5SEhs9lws"

    const start = () => {
        socket.emit("play"/*, "username"*/);
        setIsPlaying(true);
        // isPlaying = true;
        // alert(isPlaying)
    }
    
    const pause = () => {
        socket.emit("pause"/*, "username"*/);
        // isPlaying = false;
        setIsPlaying(false);
        // alert(isPlaying)
    }

    const [video, setVideo] = useState("https://youtu.be/e91M0XLX7Jw")

    function nextVideo() {
        setVideo(prevVideo => prevVideo = newVideo)
    }

    // var isPlaying = false;
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    return (
        <>
        {roomData.success === true ? (
            <div>
                <h2>Room: {roomData.roomName} </h2>
                <div>{isPlaying ? "Playing" : "Not Playing"}</div>
                <ReactPlayer url={video} controls={true} volume={0.5} onPlay={start} onPause={pause} onEnded={nextVideo} playing = {isPlaying} />
            </div>
        ) : (
            <div>
                <h2>Invalid Room</h2>
            </div>
        )}

        </>
    )
}


export default Room;