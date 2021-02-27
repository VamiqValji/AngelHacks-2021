import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player/lazy';

interface RoomProps {}


const Room: React.FC<RoomProps> = ({}) => {

    const [currentVideo, setCurrentVideo] = useState<string>("");

    const [queue, setQueue] = useState<string[]>([]);

    useEffect(() => {
        setQueue((prev) => [...prev,"https://www.youtube.com/watch?v=iv8rSLsi1xo&ab_channel=AnsonAlexander"]);
        setCurrentVideo("https://www.youtube.com/watch?v=iv8rSLsi1xo&ab_channel=AnsonAlexander");
    }, [setQueue, setCurrentVideo])

    const changeUrl = (url:any) => {
        setCurrentVideo(url);
    }

    var newVideo = "https://www.youtube.com/watch?v=Rq5SEhs9lws"

    const start = () => {
        setIsPlaying(true);
        // isPlaying = true;
        alert(isPlaying)
    }
    
    const pause = () => {
        // isPlaying = false;
        setIsPlaying(false);
        alert(isPlaying)
    }

    const [video, setVideo] = useState("https://youtu.be/e91M0XLX7Jw")

    function nextVideo() {
        setVideo(prevVideo => prevVideo = newVideo)
    }

    // var isPlaying = false;
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    return (
        <div>
            <ReactPlayer url={video} controls={true} volume={0.5} onPlay={start} onPause={pause} onEnded={nextVideo} playing = {isPlaying} />
        </div>
    )
}


export default Room;