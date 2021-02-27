import { useState, useEffect } from 'react'
import ReactPlayer from 'react-player/youtube'

interface Props {}


const Room: React.FC<Props> = () => {

    const [currentVideo, setCurrentVideo] = useState<string>("");

    const [queue, setQueue] = useState<string[]>([]);

    useEffect(() => {
        setQueue((prev) => [...prev,"https://www.youtube.com/watch?v=iv8rSLsi1xo&ab_channel=AnsonAlexander"]);
        setCurrentVideo("https://www.youtube.com/watch?v=iv8rSLsi1xo&ab_channel=AnsonAlexander");
    }, [setQueue, setCurrentVideo])

    const changeUrl = (url:any) => {
        setCurrentVideo(url);
    }

    return (
        <div>
            <ReactPlayer url='https://www.youtube.com/watch?v=e91M0XLX7Jw' controls={true} volume={0.5} />
        <button onClick={() => changeUrl("test")}>ttt</button>
            {currentVideo}
        </div>
    );
}

export default Room;