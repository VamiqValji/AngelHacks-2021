import { useState, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player/lazy'
import CanvasDraw from "react-canvas-draw";

interface RoomProps {}


const Room: React.FC<RoomProps> = ({}) => {
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



    const [data,setData] = useState(String);
    function getData(val:any) {
        
        if(val != "") { 
             setData(val)
        }
        
    }

    function clicked() {
        if(data != "") {
        setQueue((prev) => [...prev, data]);
        }
    }

    function ListItem(props:any) {
        return (
        <li style={{color: "red"}}>{props.value}</li>
        )
    }

    function sharingIsCaring() {

    }

    
    return (
        <div>
            <h1>Current Video: <a href={currentVideo}> </a> </h1>
            <ReactPlayer url={currentVideo} controls={true} volume={0.5} onPlay={start} onPause={pause} onEnded={nextVideo} playing = {isPlaying} style={{ margin: "0 auto"}}/>
            <input type="text" size= {50} ref={inputRef} onChange={() => {getData(inputRef.current.value)}}  style={{   display: "block", margin:"auto"}}/>
            <button  style={{   display: "block", margin:"auto"}} onClick={ (e)=> {
                clicked()
                inputRef.current.value = ""
                setData("")} }>Enter The URL And Click Me!</button>
            <button style={{display: "block", margin:"auto"}} onClick ={()=> {nextVideo()}}>click to skip</button>
            <h2>Queue:</h2>
            <ul>
                {queue.map((number) =>
                 <ListItem key={number.toString()}
                value={number} />
                )}
            </ul>

            <CanvasDraw getSaveData={sharingIsCaring} style={{ float:"right", position: "relative", top: "3px"}} canvasHeight = {700}/>
        </div>
            
    )
}


export default Room;