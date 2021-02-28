import { useState, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player/lazy'
import CanvasDraw from "react-canvas-draw";

interface RoomProps {}



const Room: React.FC<RoomProps> = ({}) => {
    const state = {
        color: "#ffc600",
        width: 400,
        height: 400,
        brushRadius: 10,
        lazyRadius: 12
      };
    const inputRef = useRef<any>(null);

    const [currentVideo, setCurrentVideo] = useState<string>("");

    const [queue, setQueue] = useState<string[]>([]);

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
    var isPlaying = false;

    const start = () => {
        
        isPlaying = true;
    }
    
    const pause = () => {
        isPlaying = false;
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

    return (
        <div>
            <h1>Current Video: <a href={currentVideo}> </a> </h1>
            <ReactPlayer url={currentVideo} controls={true} volume={0.5} onPlay={start} onPause={pause} onEnded={nextVideo} playing = {isPlaying} onSeek ={(sec)=>time(sec)} style={{ margin: "0 auto"}} width={888} height={500}/>
            <input type="text" size= {50} ref={inputRef} onChange={() => {getData(inputRef.current.value)}}  style={{   display: "block", margin:"auto"}}/>
            <button  style={{   display: "block", margin:"auto"}} onClick={ (e)=> {
                clicked()
                inputRef.current.value = ""
                setData("")} }>Enter The URL And Click Me!</button>
            <button style={{display: "block", margin:"auto"}} onClick ={()=> {nextVideo()}}>click to skip</button>
            

            <CanvasDraw style={{display: "block", margin:"auto"}} canvasHeight = {250} canvasWidth ={900} ref={canvasRef}/>
            <button style={{display: "block", margin:"auto"}} onClick ={()=> {canvasRef.clear()}}>Clear</button>
            <h2>Queue:</h2>
            <ul>
                {queue.map((number) =>
                 <ListItem key={number.toString()}
                value={number} />
                )}
            </ul>
        </div>
            
    )
}


export default Room;