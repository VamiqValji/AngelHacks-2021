import React, { useRef } from 'react'
import axios from "axios";

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
