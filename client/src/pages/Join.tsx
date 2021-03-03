import React, { useRef, useEffect, useState } from 'react'
import axios from "axios";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams,
    Redirect
} from "react-router-dom";
import io from "socket.io-client";

// let socket;

interface JoinProps {

}

const Join: React.FC<JoinProps> = ({}) => {

    const [roomJoined, setRoomJoined] = useState(false);

    const roomName = useRef<HTMLInputElement>(null);
    const inputName = useRef<HTMLInputElement>(null);
    
    const joinRoom = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const resp = await axios.post("https://watchsocket.herokuapp.com/s/join", 
            {
                name: inputName.current?.value,
                roomName: roomName.current?.value
            });
            setRoomJoined(true);
            // console.log("res data: ", resp.data);
        } catch (err) {
            console.error(err);
        }
    }

    let roomID:any = useParams();
    console.log(roomID);
    useEffect(() => {
        roomID = roomID.roomID;
        const getResponse = async (roomID:string) => {
            if (roomID.length > 3) {
                try {
                    const resp = await axios.post("https://watchsocket.herokuapp.com/s/join", 
                    {
                        name: inputName.current?.value,
                        roomName: roomName.current?.value,
                        roomID: roomID
                    });
                    setRoomJoined(true);
                    // console.log("res data: ", resp.data);
                } catch (err) {
                    console.error(err);
                }
            }    
        }

        getResponse(roomID);
    }, [])

    if (roomJoined) {
        return (
        <>
            <div className="containerContainer">
            <div className="container">
                <h2>Room Joined</h2>
            </div>
            </div>
        </>
        )
    } else {
        return (
            <>
                <div className="containerContainer">
                    <div className="container">
                        <h2>Join Room</h2>
                        <form onSubmit={(e) => joinRoom(e)} >
                            <h3>Room Name</h3>
                            <input className="center" ref={roomName} type="text" placeholder="Enter room name..." />
                            <br/>
                            <h3>Username</h3>
                            <input className="center" ref={inputName} type="text" placeholder="Enter your name..." />
                            <br/>
                            <button className="center">Join</button>
                        </form>
                    </div>
                </div>
            </>
        );
    }
}

export default Join;
