import { useState, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player/lazy'
import CanvasDraw from "react-canvas-draw";
import {
    useParams,
} from "react-router-dom";
import io from "socket.io-client";
import { SketchPicker } from 'react-color';

interface RoomProps {}


let socket;

const Room: React.FC<RoomProps> = ({}) => {
    const state = {
        color: "#ffc600",
        width: 400,
        height: 400,
        brushRadius: 10,
        lazyRadius: 12
      };
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
      }, [ENDPOINT, roomID, setRoomData, setIsPlaying])

    useEffect(() => {
        //setQueue((prev) => [...prev,"https://www.youtube.com/watch?v=iv8rSLsi1xo&ab_channel=AnsonAlexander"]);
        setCurrentVideo("https://www.youtube.com/watch?app=desktop&feature=share&v=ZbZSe6N_BXs");
    }, [setQueue, setCurrentVideo])

    function nextVideo() {
        setCurrentVideo(queue[0])
        let temps = queue;
        temps.shift();
        setQueue(temps);

    }

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

    const videoStarted = () => {
        setIsPlaying(false);
    }

    const time = (sec:any) => {
        alert(sec);
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
            if(ReactPlayer.canPlay(data)) {
                setQueue((prev) => [...prev, data]);
            } else {
                alert("Cannot Play that. Please Try Another URL")
            }
        }
    }

    function ListItem(props:any) {
        return (
        <li style={{color: "red"}}>{props.value}</li>
        )
    }

    const [colorBrush,setColorBrush] = useState(String);

    return (
        <div className="room">
           {roomData.success === true ? (
               <div>
                   <SketchPicker />
            <h1>Current Video: <a href={currentVideo}> </a> </h1>
            <ReactPlayer 
                url={currentVideo} 
                controls={true} 
                volume={0.5} 
                onStart={videoStarted}
                onPlay={start} 
                onPause={pause} 
                onEnded={nextVideo} 
                playing = {isPlaying} 
                onProgress ={(played)=>time(played)} 
                style={
                    { margin: "0 auto"}
                } 
                width={888} 
                height={500}
                    />

            <input type="text" size= {50} ref={inputRef} onChange={() => {getData(inputRef.current.value)}}  style={{   display: "block", margin:"auto"}}/>
            <br></br>
            <br></br>
            <button  style={{   display: "block", margin:"auto"}} onClick={ (e)=> {
                clicked()
                inputRef.current.value = ""
                setData("")} }>Enter The URL And Click Me!</button>
            <button style={{display: "block", margin:"auto"}} onClick ={()=> {nextVideo()}}>Click to Skip</button>
            
            <div className="queueContainer">
                <h2 className="center">Queue:</h2>
                {queue.length > 0 ? (
                    <ul className="center">
                    {queue.map((number) =>
                    <ListItem key={number.toString()}
                    value={number} />
                    )}
                </ul>
                ) : (
                    <ul className="center">Nothing here!</ul>
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
            
    )
}
//<h2>Room: {roomData.roomName} </h2>



export default Room;