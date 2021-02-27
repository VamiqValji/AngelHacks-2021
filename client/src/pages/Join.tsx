import React, { useRef, useEffect } from 'react'
import axios from "axios";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams,
    Redirect
} from "react-router-dom";

interface JoinProps {

}

const Join: React.FC<JoinProps> = ({}) => {



    const roomName = useRef<HTMLInputElement>(null);
    const inputName = useRef<HTMLInputElement>(null);
    
    const joinRoom = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const resp = await axios.post('http://localhost:3001/join', 
            {
                name: inputName.current?.value,
                roomName: roomName.current?.value
            });
            console.log("res data: ", resp.data);
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
                    const resp = await axios.post('http://localhost:3001/join', 
                    {
                        name: inputName.current?.value,
                        roomName: roomName.current?.value,
                        roomID: roomID
                    });
                    console.log("res data: ", resp.data);
                } catch (err) {
                    console.error(err);
                }
            }    
        }

        getResponse(roomID);
    }, [])

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

export default Join;
