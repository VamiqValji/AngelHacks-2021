import React from 'react'
import { useState, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player/youtube'
import CanvasDraw from "react-canvas-draw";
import {
    useParams,
} from "react-router-dom";
import io from "socket.io-client";
import { SketchPicker } from 'react-color';

interface RoomProps {}


let socket;

const Room: React.FC<RoomProps> = ({}) => {
    
    const inputRef = useRef<any>(null);

    const ENDPOINT = "http://localhost:3001";

    let roomID:any = useParams();
    console.log(roomID);
    roomID = roomID.roomID;

    const [roomData, setRoomData] = useState<any>({});

    const [currentVideo, setCurrentVideo] = useState<string>("");

    const [queue, setQueue] = useState<string[]>([]);

    const [isPlaying, setIsPlaying] = useState<boolean>(true);

    useEffect(() => {
        socket = io(ENDPOINT);
        // console.log("connected", roomID);
        socket.emit("connected", roomID);

        socket.on("connectedResponse", (res) => {
            console.log("CONNECTED RES",res);
            setRoomData(res);
            console.log("connectRes:res.dataList.queue", res.dataList.queue)
            setQueue(res.dataList.queue);
        })

        
        socket.on("changeTime", data => {
            videoRef.current.seekTo(data, 'seconds')
        })
    
        socket.on("playClient", (data) => {
        //   console.log(data);
            setIsPlaying(true);
        })

        socket.on("pauseClient", (data) => {
            // console.log(data);
            setIsPlaying(false);
        })
    
        socket.on("updateQueueClient", (data) => {
            console.log("data.queue", data.queue)
            setQueue(data.queue);
        })

        socket.on("nextVideoClient", (data) => {
            console.log("nextVideoClient", data);
            setQueue(data.queue);
            setCurrentVideo(data.queue[0]);
        })

        return () => {
          socket.emit("disconnected", "disconnected");
          socket.disconnect();
          socket.off();
        }
      }, [ENDPOINT, roomID, setRoomData, setIsPlaying])

    useEffect(() => {
        //setQueue((prev) => [...prev,"https://www.youtube.com/watch?v=iv8rSLsi1xo&ab_channel=AnsonAlexander"]);
        setCurrentVideo("https://www.youtube.com/watch?app=desktop&feature=share&v=ZbZSe6N_BXs");
    }, [setQueue, setCurrentVideo])

    function nextVideo() {
        let temps = queue;
        console.log("before",temps);
        let i = temps.shift();
        if (i !== undefined) {
            socket.emit("nextVideo", {
                username: "test",
                queue: temps
            });
            console.log("after", temps);
            setQueue(temps);
            setCurrentVideo(temps[0]);
        }
    }

    const handleTime = () => {
        socket.emit("time", videoRef.current.getCurrentTime());
    }

    const start = () => {
        //
        socket.emit("play"/*, "username"*/);
        setIsPlaying(true);
        // isPlaying = true;
        // alert(isPlaying)
    }
    
    const pause = () => {
        //videoRef.current.seekTo(currentTime, 'seconds')
        socket.emit("pause"/*, "username"*/);
        // isPlaying = false;
        setIsPlaying(false);
        // alert(isPlaying)
    }

    const videoRef = useRef<any>(null);
    const videoStarted = () => {
        setTimeout(() => setIsPlaying(false), 200);
        videoRef.current.seekTo(0, 'seconds')
        videoRef.current.muted=false;
    }

    const time = (sec:any) => {
        //alert(sec);
    }

    const [data,setData] = useState(String);
    function getData(val:any) {
        
        if(val != "") { 
             setData(val)
        }
        
    }

    var canvasRef = useRef<any>(null);

    function clicked() {
        if(data != "") {
            if (ReactPlayer.canPlay(data)) {
                // setQueue((prev) => [...prev, data]);
                // console.log("queue", queue);
                let temp = queue;
                temp.push(data);
                socket.emit("updateQueue", {
                    queue: temp,
                    username: "test"
                });
            } else {
                alert("Cannot Play that. Please Try Another URL")
            }
        }
    }

    function ListItem(props:any) {
        return (
        <li>{props.value}</li>
        )
    }
    const [seekTime ,setSeekTime] = useState(0);
    function handleSeeking(seconds) {
        console.log(seekTime)                       //9                    //15
        if(seconds.playedSeconds - seekTime > 2 || seconds.playedSeconds - seekTime < -2) {
            handleTime()
            setSeekTime(seconds.playedSeconds);
        } else {
            setSeekTime(seconds.playedSeconds);
        }
    }

    const [colorBrush,setColorBrush] = useState(String);
    const [currentTime, setCurrentTime] = useState(Number)
    const [userUsername, setUserUsername] = useState<String>("")
    //videoRef.current.seekTo(videoRef.current.getCurrentTime(), 'seconds')

    // while(userUsername.length <= 0) {
    //     let herllo = prompt("Please enter your name")
    //     if(herllo != null) {
    //         if(herllo.length > 0) {
    //             setUserUsername(herllo)
    //             break;
    //         }
    //     }
        
    // }
    

    return (
    <body>
        <div className="room">
           {roomData.success === true ? (
               <div>
                   <SketchPicker />
            <h1 >Current Video: <a href={currentVideo}> </a> </h1>
            {console.log(isPlaying)}
            <ReactPlayer 
                ref = {videoRef}
                url={currentVideo} 
                controls={true} 
                volume={0.5}
                //onSeeked={(seconds) => console.log(seconds)}
                //onReady={} 
                onStart={() => videoStarted()}
                onPlay={start} 
                onPause={pause} 
                onEnded={nextVideo} 
                playing = {isPlaying} 
                onProgress ={(seconds)=>  {handleSeeking(seconds)}}
                muted={true}
                style={
                    { margin: "0 auto"}
                } 
                width={888} 
                height={500}
                alt = {"hello"}
                    />

            <input placeholder="Enter URL here..." type="text" size= {50} ref={inputRef} onChange={() => {getData(inputRef.current.value)}}  style={{   display: "block", margin:"auto"}}/>
            <br></br>
            <br></br>
            <button  style={{   display: "block", margin:"auto"}} onClick={ (e)=> {
                if (inputRef.current.value.length > 0) {
                    clicked()
                    inputRef.current.value = ""
                    setData("")
                }
                } }>Enter The URL And Click Me!</button>
            <button style={{display: "block", margin:"auto"}} onClick ={()=> {nextVideo()}}>Click to Skip</button>
            
            <div className="queueContainer">
                <h2 className="center">Queue:</h2>
                {queue.length > 0 ? (
                    <ul className="center">
                    {queue.map((number) =>
                        <ListItem key={number.toString() + Math.random()}
                        value={number} />
                    )}
                </ul>
                ) : (
                    <ul className="center">
                        <li>Nothing here!</li>
                    </ul>
                )}

            </div>

            <CanvasDraw style={{display: "block", margin:"auto"}} canvasHeight = {250} canvasWidth ={900} ref={canvasRef} brushColor ={colorBrush}/>
            {//}<button style={{display: "block", margin:"auto"}} onClick ={()=> {canvasRef.clear()}}>Clear</button>
            }
            </div>
            
           ) : (
            <div className="center">
               <h2>Invalid Room</h2>
            </div>
           ) } 
        </div>
        </body>
            
    )
}
//<h2>Room: {roomData.roomName} </h2>



export default Room;