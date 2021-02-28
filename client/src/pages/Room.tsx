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

    const [queue, setQueue] = useState<string[]>([""]);

    const [isPlaying, setIsPlaying] = useState<boolean>(true);

    const [userUsername, setUserUsername] = useState<string>("")
    const inputUsernameRef = useRef<HTMLInputElement>(null);

    const chatArea = useRef<any>(null);
    const inputChatArea = useRef<any>(null);

    const Modal = () => {
        
        const submitUsername = (username:any) => {
            console.log(username);
            setUserUsername(username);
        }
        
        return (
            <>
                <div className="modalBackground">
                <div className="modalContainer">
                    <h1>Please Enter Your Username To Join The Room</h1>
                    <input ref={inputUsernameRef} placeholder="Enter your username..." type="text"/>
                    <button onClick={() => submitUsername(inputUsernameRef.current?.value)} >Submit</button>
                </div>
                </div>
            </>
        )
    }

    const MsgOrEventHandler = (message:string, msgOrEvent:"msg" | "event", username: string, who?:"you" | "other", event?:string) => {

        const currentTime = new Date().toLocaleTimeString();
        let span = document.createElement("div");
        
        let WHO;
        if (who === "you") {
            socket.emit("sendMessage", {
                username: userUsername,
                message: message,
            });
            WHO = "(You)";
        } else if (who === "other") {
            WHO = "";
        }

        let USERNAME;
        if (username !== undefined || username !== userUsername) {
            USERNAME = username;
        } else {
            USERNAME = userUsername;
        }

        if (msgOrEvent === "msg") {
            span.innerHTML = `<span key={${message + Math.random()}} id=${who}><div><li>${USERNAME}<li class="who">${WHO}</li></li><li class="currentTime">${currentTime}</li></div>${message}</span>`;
        } else if (msgOrEvent === "event") {
            span.innerHTML = `<span style={{fontSize:25}}><b>${USERNAME}</b> ${event}.</span>`;
        }
        // document.getElementsByClassName("messageArea")[0].appendChild(span);
        if (who === "you") {
            inputChatArea.current.value = "";
        }
        // for (let i = 0; i < chatArea.current?.children.length; i++) {
        //     if (chatArea.current?.children[i].value === `${USERNAME} ${event}.`) {
        //         return;
        //     }
        // }
        chatArea.current?.append(span);
        chatArea.current?.scrollBy(0,chatArea.current?.scrollHeight);

        // const sendMsgOREventToServer = () => {

        // }
    
        // const addMsgOREventToDom = () => {
    
        // }
    }

    const submitMessage = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (inputChatArea.current?.value.length <= 0) return;
        console.log(inputChatArea.current?.value);
        console.log(chatArea.current);
        MsgOrEventHandler(inputChatArea.current.value, "msg", userUsername, "you");
        // MsgOrEventHandler("other test", "msg", userUsername, "other");
        // MsgOrEventHandler(inputChatArea.current.value, "event", userUsername, "other", "joined");
        // MsgOrEventHandler(inputChatArea.current.value, "event", userUsername, "other", "paused");
    }

    // socket.emit("sendEvent", {
    //     username: userUsername,
    //     event: "event",
    // });

    useEffect(() => {
        socket = io(ENDPOINT);
        // console.log("connected", roomID);
        socket.emit("connected", {
            roomID: roomID,
            username: userUsername
        });
        // socket.emit("sendEvent", {
        //     username: userUsername,
        //     event: "joined the room"
        // });

        socket.on("connectedResponse", (res) => {
            console.log("CONNECTED RES",res);
            setRoomData(res);
            console.log("connectRes:res.dataList.queue", res.dataList.queue)
            setQueue(res.dataList.queue);
        })
        
        socket.on("changeTime", data => {
            videoRef.current.seekTo(data.currentTime, 'seconds')
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

        socket.on("receiveMessage", (data) => {
            MsgOrEventHandler(data.message, "msg", data.username, "other");
        })

        socket.on("nextVideoClient", (data) => {
            //console.log("nextVideoClient", data);
            let temp = data.queue;
            setCurrentVideo(temp[0]);
            temp.shift()
            setQueue(temp);
        })

        socket.on("userJoined", (data) => {
            console.log("userJoined", data);
            MsgOrEventHandler("", "event", data.username, "other", "joined");
        })

        socket.on("receiveEvent", (data) => {
            let whoArg;

            if (data.username === userUsername) {
                whoArg = "you";
            } else {
                whoArg = "other"
            }

            // MsgOrEventHandler("","event",data.username, whoArg, data.event);
            MsgOrEventHandler("test", "event", userUsername, "other", "joined");

        })

        return () => {
        //   socket.emit("disconnected", {
        //     username: userUsername,
        //   });
        // socket.emit("sendEvent", {
        //     username: userUsername,
        //     event: "left the room"
        // });
          socket.disconnect();
          socket.off();
        }
      }, [ENDPOINT, roomID, setRoomData, setIsPlaying, userUsername, setUserUsername])

    useEffect(() => {
        //setQueue((prev) => [...prev,"https://www.youtube.com/watch?v=iv8rSLsi1xo&ab_channel=AnsonAlexander"]);
        setCurrentVideo("https://www.youtube.com/watch?app=desktop&feature=share&v=ZbZSe6N_BXs");
        //setQueue((prev) => [...prev, "yeet"]);
    }, [setQueue, setCurrentVideo])

    function nextVideo() {
        let temps = queue;
        if(temps[0] !== undefined || temps.length > 0) {
            socket.emit("nextVideo", {
                username: userUsername,
                queue: temps
            });
            // socket.emit("sendEvent", {
            //     username: userUsername,
            //     event: "skipped"
            // });
        }
    }

    const handleTime = () => {
        socket.emit("time", {
            username: userUsername,
            currentTime: videoRef.current.getCurrentTime()
        });
        // socket.emit("sendEvent", {
        //     username: userUsername,
        //     event: "changed the timestamp"
        // });
    }

    const start = () => {
        //
        socket.emit("play", {
            username: userUsername,
        });
        // socket.emit("sendEvent", {
        //     username: userUsername,
        //     event: "started the video"
        // });
        setIsPlaying(true);
        // isPlaying = true;
        // alert(isPlaying)
    }
    
    const pause = () => {
        //videoRef.current.seekTo(currentTime, 'seconds')
        socket.emit("pause", {
            username: userUsername,
        });
        // socket.emit("sendEvent", {
        //     username: userUsername,
        //     event: "paused the video"
        // });
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
                    username: userUsername,
                });
                // socket.emit("sendEvent", {
                //     username: userUsername,
                //     event: "updated the queue"
                // });
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
    const linkRef = useRef<any>(null);
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

    const copyToClipboard = () => {
        linkRef.current.select();
        linkRef.current.setSelectionRange(0, 99999);
        document.execCommand("copy");
    }
    
    if (userUsername.length > 0) {
        return (
            <>
                {/* <body> */}
                <div className="room">
                {roomData.success === true ? (
                    <div>
                        <h1>Room Name: {roomData.roomName}</h1>
                        <SketchPicker />
                    <h1 >Current Video: <a href={currentVideo}> </a> </h1>
                    {console.log(isPlaying)}
                    <div className="reactPlayerContainer">
                        {currentVideo ? (
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
                        ) : (
                            <span><h2>Add Videos To The Queue!</h2></span>
                        )}

                    </div>
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
                    <div className="container">
                    <div className="messagingContainer">
                        <h2>
                        Chat & Events
                        <div>
                        </div>
                        </h2>
                        <div className="messageAreaContainer">
                        <div ref={chatArea} className="messageArea">
                        {/* <span id="you"><br/>messagemessagemessagemessagemessagemessagemessage</span>
                                {[1,2,3,5,6,8,9].map((n) => {
                                    return <span key={n} id="other"><br/>{n}</span>
                                })} */}
                        </div>
                        </div>
                        <div className="messageBoxContainer">
                        <form onSubmit={(e) => submitMessage(e)} className="messageBox">
                            <span>
                            <input
                                ref={inputChatArea}
                                placeholder="Enter message here..."
                                type="text"
                                name="Message"
                                id="msg"
                            />
                            <button>Send</button>
                            </span>
                        </form>
                        </div>
                        </div>
                        </div>
                    </div>
                    
                ) : (
                    <div className="center">
                    <h2>Invalid Room</h2>
                    </div>
                ) } 
                </div>
                </> 
            )
    } else {
        return (
            <>{roomData.success === true ? (<Modal />) : (
            <div style={{marginTop:20}}className="center">
            <h2>Invalid Room</h2>
            </div>
            )}
        </>
        )
    }

}

export default Room;