import React from 'react'
import ReactPlayer from 'react-player/youtube'

interface RoomProps {

}

const Room: React.FC<RoomProps> = ({}) => {
    var currentVideo = ""
    var queue = ["https://www.youtube.com/watch?v=iv8rSLsi1xo&ab_channel=AnsonAlexander", "https://www.youtube.com/watch?v=e91M0XLX7Jw"];

    return (
        <div>
            <ReactPlayer url='https://www.youtube.com/watch?v=e91M0XLX7Jw' controls={true} volume={0.5} />
        </div>
    );
}

export default Room;